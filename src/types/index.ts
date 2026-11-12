export type Role = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
export type ViewRole = "user" | "admin";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type BloodGroup =
  | "UNKNOWN"
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  provider: "google" | "credentials";
  role: Role;
  status?: UserStatus;

  // Profile update fields matching Prisma schema
  fatherName?: string | null;
  motherName?: string | null;
  bloodGroup?: BloodGroup | string | null;
  bio?: string | null;
  summary?: string | null;
  profession?: string | null;
  village?: string | null;
  currentLocation?: string | null;
  whatsappNumber?: string | null;
  facebookProfile?: string | null;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
              expires_in?: number;
            }) => void;
            error_callback?: (error: unknown) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}
