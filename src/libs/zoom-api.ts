import fetch from "node-fetch";

var moment = require('moment');

const zoomBaseUrl = process.env.ZOOM_API_URL;

export async function zoomGetAccessToken() {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;
    const basicAuth = zoomCreateAuthorization(clientId, clientSecret);
    console.log('basicAuth', basicAuth)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Host': 'zoom.us',
                'Authorization': `Basic ${basicAuth}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status} ${response.statusText}`);
        }
        const responseData = await response.json();
        console.log(responseData.access_token);
        return responseData.access_token;
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
}

export function zoomCreateAuthorization(client_id: string, client_secret: string) {
    return Buffer.from(`${client_id}:${client_secret}`).toString('base64');
}

export async function messageActionHandler(message: string) {
    const spaceIndex = message.indexOf(" ");
    if (message.startsWith('Schedule for')) {
        const dateAndTimeStr = message.substring(spaceIndex + 1);
        const dateTime = moment(dateAndTimeStr, 'HH:mm DD/MM/YY');
        const transformedDateTime = dateTime.format('YYYY-MM-DDTHH:mm:ss[Z]')
        console.log('transformedDateTime', transformedDateTime);
        const meeting = await zoomCreateMeeting(transformedDateTime);
        console.log('meeting', meeting);
        if (meeting) {
            return `Meeting created successfully! Start: ${meeting.start_time}! Link to join: ${meeting.join_url}`;
        } else {
            return 'Error occurred while creating meeting!';
        }
    }
    if (message.startsWith('Cancel')) {
        const dateAndTimeStr = message.substring(spaceIndex);
        const dateTime = moment(dateAndTimeStr, 'HH:mm DD/MM/YY');
        const transformedDateTime = dateTime.format('YYYY-MM-DDTHH:mm:ss[Z]')
        console.log('transformedDateTime', transformedDateTime);
        const scheduledMeethings = await zoomGetScheduledMeetings(transformedDateTime);
        console.log('scheduledMeethings', scheduledMeethings);
        if (scheduledMeethings) {
            const cancelMeeting = await zoomCancelMeeting(scheduledMeethings.id);
            console.log('cancelMeeting', cancelMeeting);
            if (cancelMeeting) {
                return cancelMeeting;
            } else {
                return 'Error occurred while canceling meeting!';
            }
        } else {
            return 'No meeting found!';
        }
    }
    if (message.startsWith('Reschedule')) {
        const dateAndTimeStr = message.substring(spaceIndex);
        const dateTime = moment(dateAndTimeStr, 'HH:mm DD/MM/YY');
        const transformedDateTime = dateTime.format('YYYY-MM-DDTHH:mm:ss[Z]')
        console.log('transformedDateTime', transformedDateTime);
        const scheduledMeethings = await zoomGetScheduledMeetings(transformedDateTime);
        console.log('scheduledMeethings', scheduledMeethings);
        if (scheduledMeethings) {
            const spaceIndex = message.indexOf("to");
            const dateAndTimeStr = message.substring(spaceIndex + 3);
            const dateTime = moment(dateAndTimeStr, 'HH:mm DD/MM/YY');
            const transformedDateTime = dateTime.format('YYYY-MM-DDTHH:mm:ss[Z]')
            console.log('transformedDateTimeNEW', transformedDateTime);
            const updateMeeting = await zoomUpdateMeeting(scheduledMeethings.id, transformedDateTime);
            console.log('updateMeeting', updateMeeting);
            if (updateMeeting) {
                return updateMeeting;
            } else {
                return 'Error occurred while updating meeting!';
            }
        } else {
            return 'No meeting found!';
        }
    }
}

export async function zoomCreateMeeting(startTime: string) {
    const accessToken = await zoomGetAccessToken();
    console.log('accessToken', accessToken);
    try {
        const response = await fetch(`${zoomBaseUrl}/users/me/meetings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "agenda": "My Meeting",
                    "default_password": false,
                    "duration": 60,
                    "password": "123456",
                    "schedule_for": "jonas.meteling@gmail.com",
                    "settings": {
                        "additional_data_center_regions": [
                            "TY"
                        ],
                        "allow_multiple_devices": true,
                        "approval_type": 2,
                        "approved_or_denied_countries_or_regions": {
                            "approved_list": [
                                "CX"
                            ],
                            "denied_list": [
                                "CA"
                            ],
                            "enable": true,
                            "method": "approve"
                        },
                        "audio": "telephony",
                        "audio_conference_info": "test",
                        "calendar_type": 1,
                        "close_registration": false,
                        "contact_email": "jonas.meteling@gmail.com",
                        "contact_name": "Jonas Meeting",
                        "email_notification": true,
                        "encryption_type": "enhanced_encryption",
                        "focus_mode": true,
                        "host_video": true,
                        "jbh_time": 0,
                        "join_before_host": false,
                        "meeting_authentication": true,
                        "mute_upon_entry": false,
                        "participant_video": false,
                        "private_meeting": false,
                        "registrants_confirmation_email": true,
                        "registrants_email_notification": true,
                        "registration_type": 1,
                        "show_share_button": true,
                        "use_pmi": false,
                        "waiting_room": false,
                        "watermark": false,
                        "host_save_video_order": true,
                        "alternative_host_update_polls": true
                    },
                    "start_time": startTime,
                    "template_id": "Dv4YdINdTk+Z5RToadh5ug==",
                    "timezone": "America/Los_Angeles",
                    "topic": "My Meeting",
                    "tracking_fields": [
                        {
                            "field": "field1",
                            "value": "value1"
                        }
                    ],
                    "type": 2
                }),
        });
        return response.json();
    }
    catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
}

export async function zoomGetScheduledMeetings(date: string) {
    const accessToken = await zoomGetAccessToken();
    try {
        const result = await fetch(`${zoomBaseUrl}/users/me/meetings?type=scheduled&page_size=30&page_number=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await result.json();
        console.log('zoomGetScheduledMeetings', data);
        if (data && data.meetings) {
            return data.meetings.find((meeting: any) => meeting.start_time === date);
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
}

export async function zoomCancelMeeting(meetingId: string) {
    const accessToken = await zoomGetAccessToken();
    try {
        const result = await fetch(`${zoomBaseUrl}/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        console.log('result', result);
        return `Meeting ${meetingId} canceled successfully!`;
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
}

export async function zoomUpdateMeeting(meetingId: string, newStartTime: string) {
    const accessToken = await zoomGetAccessToken();
    try {
        const result = await fetch(`${zoomBaseUrl}/meetings/${meetingId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "start_time": newStartTime,
                }),
        });
        console.log('result', result);
        return `Meeting ${meetingId} updated to ${newStartTime} successfully!`;
    } catch (error) {
        console.error('Error occurred:', error);
        return null;
    }
}