// @ts-nocheck

export const loginWithOneID = () => {
    const CLIENT_ID = 'sizning_client_id';
    // Backenddagi callback URL
    const REDIRECT_URI = 'https://sizning-sayt.uz/auth/oneid/callback';

    window.location.href = `https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=legal`;
};