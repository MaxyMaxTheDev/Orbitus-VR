import type { Message } from '@/ai/schemas';
import type { NotificationPosition, WidgetName } from '@/contexts/settings-context';

export type UserDataType = {
  username: string;
  settings: {
    showAppBanners: boolean;
    notificationPosition: NotificationPosition;
    uiScale?: number;
    dashboardWidgets?: WidgetName[];
  };
  installedApps: string[];
  notepadContent: string;
  vrChatHistory: Message[];
};
