
'use server';

import { google } from 'googleapis';
import { format, formatDistanceToNow, isToday, isThisYear } from 'date-fns';

export interface Email {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    date: string;
    fullDate: string;
    isUnread: boolean;
}

// Function to safely extract header value
const getHeader = (headers: any[], name: string) => {
    const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
};

// Function to format the display date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
        return format(date, 'p'); // e.g., 4:30 PM
    }
    if (isThisYear(date)) {
        return format(date, 'MMM d'); // e.g., Apr 5
    }
    return format(date, 'P'); // e.g., 04/05/2023
};

export async function fetchEmails(accessToken: string): Promise<Email[]> {
    try {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });

        const gmail = google.gmail({ version: 'v1', auth });

        // 1. Get a list of message IDs
        const listResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 15,
            q: 'is:inbox',
        });

        const messageIds = listResponse.data.messages?.map((m) => m.id!) ?? [];
        if (messageIds.length === 0) {
            return [];
        }

        // 2. Fetch details for each message using a batch request
        const batch = messageIds.map(id => {
            return gmail.users.messages.get({
                userId: 'me',
                id: id,
                format: 'metadata',
                metadataHeaders: ['From', 'Subject', 'Date', 'To'],
            });
        });

        const messageResponses = await Promise.all(batch);

        // 3. Process the responses
        const emails: Email[] = messageResponses.map((res) => {
            const message = res.data;
            const headers = message.payload?.headers || [];
            
            const fromHeader = getHeader(headers, 'From');
            const fromMatch = fromHeader.match(/(.*)<(.*)>/);
            const from = fromMatch ? fromMatch[1].trim().replace(/"/g, '') : fromHeader;

            const dateHeader = getHeader(headers, 'Date');
            const date = new Date(dateHeader);

            return {
                id: message.id!,
                from: from || 'Unknown Sender',
                subject: getHeader(headers, 'Subject') || '(no subject)',
                snippet: message.snippet || '',
                date: formatDate(dateHeader),
                fullDate: format(date, 'PPpp'), // e.g., Apr 5, 2023, 4:30:00 PM
                isUnread: message.labelIds?.includes('UNREAD') ?? false,
            };
        });

        return emails;
    } catch (error: any) {
        console.error('Error fetching Gmail emails:', error.response?.data || error.message);
        if (error.code === 401 || error.response?.status === 401) {
            throw new Error('Authentication failed. Please sign out and sign in again.');
        }
        if (error.response?.data?.error?.message) {
            throw new Error(`Google API Error: ${error.response.data.error.message}`);
        }
        throw new Error('Could not connect to Gmail. Please check your connection and permissions.');
    }
}
