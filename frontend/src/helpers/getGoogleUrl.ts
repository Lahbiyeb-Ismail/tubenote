import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '@/utils/constants';

function getGoogleOAuthUrl() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    client_id: GOOGLE_CLIENT_ID as string,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    include_granted_scopes: 'true',
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const searchParams = new URLSearchParams(options);

  return `${rootUrl}?${searchParams.toString()}`;
}

export default getGoogleOAuthUrl;
