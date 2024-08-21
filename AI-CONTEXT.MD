SDKs and APIs
Back end SDKs
Next.js App Router SDK
This SDK is for Next.js version 13+ and uses Server Side Components and App Router.

New to Kinde? Get started here

If you’re using version 1 see Next.js App Router V1

If you’re using the pages router see Next.js Pages Router

Install for a new project
Link to this section
The easiest way to get started is to use the Next.js starter kit, and watch a demo video.

Install for an existing project
Link to this section
npm
yarn
pnpm
Terminal window
npm i @kinde-oss/kinde-auth-nextjs

Set callback URLs
Link to this section
In Kinde, go to Settings > Applications > [Your app] > View details.
Add your callback URLs in the relevant fields. For example:
Allowed callback URLs (also known as redirect URIs) - for example http://localhost:3000/api/auth/kinde_callback
Allowed logout redirect URLs - for example http://localhost:3000
Select Save.
Configure environment variables
Link to this section
Put these variables in a .env.local file in the root of your Next.js app. You can find these variables on your Kinde Settings > Applications > [Your app] > View details page.

KINDE_CLIENT_ID - Your business’s unique ID on Kinde
KINDE_CLIENT_SECRET - Your business’s secret key (do not share)
KINDE_ISSUER_URL - your kinde domain
KINDE_SITE_URL - where your app is running
KINDE_POST_LOGOUT_REDIRECT_URL - where you want users to be redirected to after logging out. Make sure this URL is under your allowed logout redirect URLs.
KINDE_POST_LOGIN_REDIRECT_URL - where you want users to be redirected to after authenticating.
KINDE_AUDIENCE - optional - a whitespace separated list of audiences to populate the aud claim in the token.
Replace the information in the example with your own information. You might also set different URLs depending where your project is running. They need to match the callback URLs you entered in Kinde, above.

Terminal window
KINDE_CLIENT_ID=<your_kinde_client_id>
KINDE_CLIENT_SECRET=<your_kinde_client_secret>
KINDE_ISSUER_URL=https://<your_kinde_subdomain>.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

Set up Kinde Auth Route Handlers
Link to this section
Create the following file app/api/auth/[kindeAuth]/route.js inside your Next.js project. Inside the file route.js put this code:

import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
export const GET = handleAuth();

This will handle Kinde Auth endpoints in your Next.js app.

Important! Our SDK relies on this file existing in this location specified above.

Authentication
Link to this section
Sign up and sign in
Link to this section
The SDK ships with <LoginLink> and <RegisterLink> components which can be used to start the auth flow.

import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

...

<LoginLink>Sign in</LoginLink>
<RegisterLink>Sign up</RegisterLink>

Redirecting after authentication
Link to this section
Static redirect

If you want to redirect users to a certain page after logging in, you can set the KINDE_POST_LOGIN_REDIRECT_URL environment variable in your .env.local file.

Dynamic redirect

You can also set a postLoginRedirectURL parameter to tell us where to redirect after authenticating.

import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

...

<LoginLink postLoginRedirectURL="/dashboard">Sign in</LoginLink>
<RegisterLink postLoginRedirectURL="/welcome">Sign up</RegisterLink>

This appends post_login_redirect_url to the search params when redirecting to Kinde Auth. You can achieve the same result as above, like this:

import { redirect } from "next/navigation";
...

redirect('/api/auth/login?post_login_redirect_url=/dashboard')

...

Logout
Link to this section
This is implemented in much the same way as signing up or signing in. A component is provided for you.

import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";

...

<LogoutLink>Log out</LogoutLink>

Kinde Auth data - Server
Link to this section
You can get an authorized user’s Kinde Auth data from any server component using the getKindeServerSession helper.

Method	Description
isAuthenticated	Check if the user is authenticated
getUser	Get the current user’s details
getOrganization	Get the current user’s organization
getUserOrganizations	Get all the organizations the current user belongs to
getPermission	Check if the current user has a permission
getPermissions	Get the current user’s permissions
getFlag	Get a feature flag
getBooleanFlag	Get a boolean feature flag
getIntegerFlag	Get an integer feature flag
getStringFlag	Get a string feature flag
refreshTokens	Refresh tokens to get up-to-date Kinde data
getAccessToken	Get the decoded access token
getAccessTokenRaw	Get the access token
getIdToken	Get the decoded ID token
getIdTokenRaw	Get the ID token
getClaim	Get a claim from either token
isAuthenticated
Link to this section
Check if the user is authenticated.

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {isAuthenticated} = getKindeServerSession();
const isUserAuthenticated = await isAuthenticated();

Returns
Link to this section
true;

getUser
Link to this section
Get the logged in user’s details.

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getUser} = getKindeServerSession();
const user = await getUser();

console.log(user);

Returns
Link to this section
{
  "id": "kp_123",
  "email": "example@email.com",
  "family_name": "Example",
  "given_name": "User",
  "picture": null,
  "username": "ExampleUsername",
  "phone_number": "1234567890",
  "properties": {
    "usr_city": "",
    "usr_industry": "",
    "usr_job_title": "",
    "usr_middle_name": "",
    "usr_postcode": "",
    "usr_salutation": "",
    "usr_state_region": "",
    "usr_street_address": "",
    "usr_street_address_2": ""
  }
}

getOrganization
Link to this section
Get the current user’s organization

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getOrganization} = getKindeServerSession();
const org = await getOrganization();

console.log(org);

Returns
Link to this section
{
  "orgCode": "org_123",
  "orgName": "Deafault Org",
  "properties": {
    "org_city": "",
    "org_country": "",
    "org_industry": "",
    "org_postcode": "",
    "org_state_region": "",
    "org_street_address": "",
    "org_street_address_2": ""
  }
}

getUserOrganizations
Link to this section
Get all the organizations the current user belongs to

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getUserOrganizations} = getKindeServerSession();
const userOrgs = await getUserOrganizations();

console.log(userOrgs);

Returns
Link to this section
{
  "orgCodes": ["org_123", "org_456"],
  "orgs": [
    {
      "code": "org_123",
      "name": "Deafault Org"
    },
    {
      "code": "org_456",
      "name": "Another Org"
    }
  ]
}

getPermission
Link to this section
Check if the current user has a permission.

Parameter	Type	Description
code	string	The permission code to check
Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getPermission} = getKindeServerSession();
const canEatTacos = await getPermission("eat:tacos");

console.log(canEatTacos);

Returns
Link to this section
{
  "isGranted": true,
  "orgCode": "org_123"
}

getPermissions
Link to this section
Get the current user’s permissions.

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getPermissions} = getKindeServerSession();
const permissions = await getPermissions();

console.log(permissions);

Returns
Link to this section
{
  "permissions": ["eat:tacos", "read:books"],
  "orgCode": "org_123"
}

getFlag
Link to this section
Get a feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	boolean | string | number	The default value to return if the flag is not set
type	enum (b | s | i)	The type of the flag
Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getFlag} = getKindeServerSession();
const billingFlag = await getFlag("billing", false, "b");

console.log(billingFlag);

Returns
Link to this section
{
  "code": "billing",
  "type": "boolean",
  "value": true,
  "defaultValue": false,
  "is_default": false
}

getBooleanFlag
Link to this section
Get a boolean feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	boolean	The default value to return if the flag is not set
Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getBooleanFlag} = getKindeServerSession();
const billingFlag = await getBooleanFlag("billing", false);

console.log(billingFlag);

Returns
Link to this section
true;

getIntegerFlag
Link to this section
Get a boolean feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	boolean	The default value to return if the flag is not set
Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getIntegerFlag} = getKindeServerSession();
const billingVersion = await getIntegerFlag("billingVersion", 0);

console.log(billingVersion);

Returns
Link to this section
2

getStringFlag
Link to this section
Get a string feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	string	The default value to return if the flag is not set
Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getStringFlag} = getKindeServerSession();
const theme = await getStringFlag("theme", "system");

console.log(theme);

Returns
Link to this section
"light"

refreshTokens
Link to this section
Refresh tokens to get up-to-date Kinde data

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {someUpdateFunction} from "@/app/actions";

const {refreshTokens} = getKindeSeverSession();
await someUpdateFunction({
  param_1: "value_1",
  param_2: "value_2"
});
await refreshTokens();

getAccessToken
Link to this section
Get the decoded access token

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getAccessToken} = getKindeServerSession();
const accessToken = await getAccessToken();

console.log(accessToken);

Returns
Link to this section
{
  "aud": ["your-api"],
  "azp": 1234567890,
  "email": "example@email.com",
  "exp": 1234567890,
  "feature_flags": {
    "isonboardingcomplete": {
      "t": "b",
      "v": false
    }
  },
  "iat": 1234567890,
  "iss": "https://your-kinde-subdomain.kinde.com",
  "jti": "7802e2d2-asdf-431e-bc72-5ed95asdf475d",
  "org_code": "org_123",
  "org_name": "Default Org",
  "organization_properties": {
    "kp_org_city": {}
  },
  "permissions": ["create:template"],
  "roles": [
    {
      "id": "018ee9aa-f92b-83fc-1d40-1234567890",
      "key": "admin",
      "name": "Admin"
    }
  ],
  "scp": ["openid", "profile", "email", "offline"],
  "sub": "kp_6123456789009876",
  "user_properties": {
    "kp_usr_city": {}
  }
}

getAccessTokenRaw
Link to this section
Get the access token

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getAccessTokenRaw} = getKindeSeverSesion();
const accessToken = await getAccessTokenRaw();

console.log(accessToken);

Returns
Link to this section
eyJhxxx.eyJhdxxx.A4djjxxx

getIdToken
Link to this section
Get the decoded ID token

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getIdToken} = getKindeSeverSesion();
const idToken = await getIdToken();

console.log(idToken);

Returns
Link to this section
{
  "at_hash": "ZY6jx1SGjzgkHGJ_2Jabcd",
  "aud": ["feb8e697b967466eacb96d26c5ca0e12"],
  "auth_time": 1234567890,
  "azp": "feb8e099xxx",
  "email": "example@email.com",
  "email_verified": true,
  "exp": 123456789,
  "ext_provider": {
    "claims": {
      "connection_id": "bcc486xxx",
      "email": "example@email.com",
      "family_name": "User",
      "given_name": "Example",
      "is_confirmed": true,
      "picture": "https://lh3.googleusercontent.com/a/ACgxxx",
      "profile": {
        "email": "example@email.com",
        "family_name": "User",
        "given_name": "Example",
        "id": "1234567890",
        "name": "Example user",
        "picture": "https://lh3.googleusercontent.com/a/ACgxxx",
        "verified_email": true
      }
    },
    "connection_id": "bccxxx",
    "name": "Google"
  },
  "family_name": "User",
  "given_name": "Example",
  "iat": 1234567890,
  "iss": "https://your-kinde-subdomain.kinde.com",
  "jti": "e7e18303-0ea5-402d-932c-xxx",
  "name": "Example user",
  "org_codes": ["org_123"],
  "organizations": [
    {
      "id": "org_123",
      "name": "Default Organization"
    }
  ],
  "picture": "https://lh3.googleusercontent.com/a/ACgxxx",
  "rat": 1234567890,
  "sub": "kp_1234567890",
  "updated_at": 1234567890,
  "user_properties": {
    "kp_usr_city": {}
  }
}

getIdTokenRaw
Link to this section
Get the ID token

Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getIdTokenRaw} = getKindeSeverSesion();
const idToken = await getIdTokenRaw();

console.log(idToken);

Returns
Link to this section
eyJhxxx.eyJhdxxx.A4djjxxx

getClaim
Link to this section
Get a claim from either token

Parameter	Type	Description
claim	string	The claim key
type	enum (access_token | id_token)	The token to get the claim from
Example
Link to this section
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const {getClaim} = getKindeSeverSesion();
const username = await getClaim("preferred_username", "id_token");

console.log(idToken);

Returns
Link to this section
"exampleUsername"

Kinde Auth data - Client
Link to this section
You can get an authorized user’s Kinde Auth data from any client component using the useKindeBrowser helper.

Variable / Method	Description
isAuthenticated	Get a feature flag
user / getUser	The current in user’s details
organization / getOrganization	The current user’s organization
userOrganizations / getUserOrganizations	All the organizations the current user belongs to
getPermission	Check if the current user has a permission
permissions / getPermissions	The current user’s permissions
getFlag	Get the access token
getBooleanFlag	Get the access token
getIntegerFlag	Get the access token
getStringFlag	Get the access token
refreshData	Refresh tokens to get up-to-date Kinde data
accessToken / getAccessToken	Check if the user is authenticated
accessTokenRaw / getAccessTokenRaw	Get the current user’s details
idToken / getIdToken	Get all the organizations the current user belongs to
idTokenRaw / getIdTokenRaw	Check if the current user has a permission
isLoading	Is Kinde data loading
error	Error message if there is an error
Tip: Use isLoading to ensure the data is up to date. You can return a loading spinner or something similar if you want.

isAuthenticated
Link to this section
Check if the user is authenticated.

Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {isAuthenticated} = useKindeBrowserClient();
console.log(isAuthenticated);

Returns
Link to this section
true;

user / getUser
Link to this section
Get the logged in user’s details.

Example
Link to this section
"use client";

import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {user, getUser} = useKindeBrowserClient();
const alsoUser = getUser();

console.log(user);

Returns
Link to this section
{
  "id": "kp_123",
  "email": "example@email.com",
  "family_name": "Example",
  "given_name": "User",
  "picture": null,
  "username": "ExampleUsername",
  "phone_number": "1234567890",
  "properties": {
    "usr_city": "",
    "usr_industry": "",
    "usr_job_title": "",
    "usr_middle_name": "",
    "usr_postcode": "",
    "usr_salutation": "",
    "usr_state_region": "",
    "usr_street_address": "",
    "usr_street_address_2": ""
  }
}

organization / getOrganization
Link to this section
Get the current user’s organization

Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {organization, getOrganization} = useKindeBrowserClient();
const org = getOrganization();

console.log(organization, org);

Returns
Link to this section
{
  "orgCode": "org_123",
  "orgName": "Deafault Org",
  "properties": {
    "org_city": "",
    "org_country": "",
    "org_industry": "",
    "org_postcode": "",
    "org_state_region": "",
    "org_street_address": "",
    "org_street_address_2": ""
  }
}

userOrganizations / getUserOrganizations
Link to this section
Get all the organizations the current user belongs to

Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {userOrganizations, getUserOrganizations} = useKindeBrowserClient();
const userOrgs = getUserOrganizations();

console.log(userOrganizations, userOrgs);

Returns
Link to this section
{
  "orgCodes": ["org_123", "org_456"],
  "orgs": [
    {
      "code": "org_123",
      "name": "Deafault Org"
    },
    {
      "code": "org_456",
      "name": "Another Org"
    }
  ]
}

getPermission
Link to this section
Check if the current user has a permission.

Parameter	Type	Description
code	string	The permission code to check
Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {getPermission} = useKindeBrowserClient();
const canEatTacos = getPermission("eat:tacos");

console.log(canEatTacos);

Returns
Link to this section
{
  "isGranted": true,
  "orgCode": "org_123"
}

permissions / getPermissions
Link to this section
Get the current user’s permissions.

Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {permissions, getPermissions} = useKindeBrowserClient();
const perms = getPermissions();

console.log(permissions, permis);

Returns
Link to this section
{
  "permissions": ["eat:tacos", "read:books"],
  "orgCode": "org_123"
}

getFlag
Link to this section
Get a feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	boolean | string | number	The default value to return if the flag is not set
type	enum (b | s | i)	The type of the flag
Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {getFlag} = useKindeBrowserClient();
const billingFlag = getFlag("billing", false, "b");

console.log(billingFlag);

Returns
Link to this section
{
  "code": "billing",
  "type": "boolean",
  "value": true,
  "defaultValue": false,
  "is_default": false
}

getBooleanFlag
Link to this section
Get a boolean feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	boolean	The default value to return if the flag is not set
Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {getBooleanFlag} = useKindeBrowserClient();
const billingFlag = getBooleanFlag("billing", false);

console.log(billingFlag);

Returns
Link to this section
true;

getIntegerFlag
Link to this section
Get a boolean feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	boolean	The default value to return if the flag is not set
Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {getIntegerFlag} = useKindeBrowserClient();
const billingVersion = getIntegerFlag("billingVersion", 0);

console.log(billingVersion);

Returns
Link to this section
2

getStringFlag
Link to this section
Get a string feature flag

Parameter	Type	Description
code	string	The flag code to check
defaultValue	string	The default value to return if the flag is not set
Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {getStringFlag} = useKindeBrowserClient();
const theme = getStringFlag("theme", "system");

console.log(theme);

Returns
Link to this section
"light"

refreshData
Link to this section
Refresh tokens to get up-to-date Kinde data

Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {someUpdateFunction} from "@/app/actions";

const {refreshData} = useKindeBrowserClient();

await someUpdateFunction({
  param_1: "value_1",
  param_2: "value_2"
});
await refreshData();

accessToken / getAccessToken
Link to this section
Get the decoded access token

Example
Link to this section
"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {accessToken, getAccessToken} = useKindeBrowserClient();
const aTok = getAccessToken();

console.log(accessToken, aTok);

Returns
Link to this section
{
  "aud": ["your-api"],
  "azp": 1234567890,
  "email": "example@email.com",
  "exp": 1234567890,
  "feature_flags": {
    "isonboardingcomplete": {
      "t": "b",
      "v": false
    }
  },
  "iat": 1234567890,
  "iss": "https://your-kinde-subdomain.kinde.com",
  "jti": "7802e2d2-asdf-431e-bc72-5ed95asdf475d",
  "org_code": "org_123",
  "org_name": "Default Org",
  "organization_properties": {
    "kp_org_city": {}
  },
  "permissions": ["create:template"],
  "roles": [
    {
      "id": "018ee9aa-f92b-83fc-1d40-1234567890",
      "key": "admin",
      "name": "Admin"
    }
  ],
  "scp": ["openid", "profile", "email", "offline"],
  "sub": "kp_6123456789009876",
  "user_properties": {
    "kp_usr_city": {}
  }
}

accessTokenRaw / getAccessTokenRaw
Link to this section
Get the access token

Example
Link to this section
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {accessTokenRaw, getAccessTokenRaw} = useKindeBrowserClient();
const aTokRaw = getAccessTokenRaw();

console.log(accessTokenRaw, aTokRaw);

Returns
Link to this section
eyJhxxx.eyJhdxxx.A4djjxxx

idToken / getIdToken
Link to this section
Get the decoded ID token

Example
Link to this section
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {idToken, getIdToken} = useKindeBrowserClient();
const idTok = getIdToken();

console.log(idToken, idTok);

Returns
Link to this section
{
  "at_hash": "ZY6jx1SGjzgkHGJ_2Jabcd",
  "aud": ["feb8e697b967466eacb96d26c5ca0e12"],
  "auth_time": 1234567890,
  "azp": "feb8e099xxx",
  "email": "example@email.com",
  "email_verified": true,
  "exp": 123456789,
  "ext_provider": {
    "claims": {
      "connection_id": "bcc486xxx",
      "email": "example@email.com",
      "family_name": "User",
      "given_name": "Example",
      "is_confirmed": true,
      "picture": "https://lh3.googleusercontent.com/a/ACgxxx",
      "profile": {
        "email": "example@email.com",
        "family_name": "User",
        "given_name": "Example",
        "id": "1234567890",
        "name": "Example user",
        "picture": "https://lh3.googleusercontent.com/a/ACgxxx",
        "verified_email": true
      }
    },
    "connection_id": "bccxxx",
    "name": "Google"
  },
  "family_name": "User",
  "given_name": "Example",
  "iat": 1234567890,
  "iss": "https://your-kinde-subdomain.kinde.com",
  "jti": "e7e18303-0ea5-402d-932c-xxx",
  "name": "Example user",
  "org_codes": ["org_123"],
  "organizations": [
    {
      "id": "org_123",
      "name": "Default Organization"
    }
  ],
  "picture": "https://lh3.googleusercontent.com/a/ACgxxx",
  "rat": 1234567890,
  "sub": "kp_1234567890",
  "updated_at": 1234567890,
  "user_properties": {
    "kp_usr_city": {}
  }
}

idTokenRaw / getIdTokenRaw
Link to this section
Get the ID token

Example
Link to this section
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {idTokenRaw, getIdTokenRaw} = useKindeBrowserClient();
const idTokRaw = getIdTokenRaw();

console.log(idTokenRaw, idTokRaw);

Returns
Link to this section
eyJhxxx.eyJhdxxx.A4djjxxx

isLoading
Link to this section
Is Kinde data loading

Example
Link to this section
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {user, isLoading} = useKindeBrowserClient();

if (isLoading) return <div>Loading...</div>;

return <div>Hello {user.given_name}</div>;

Returns
Link to this section
true

error
Link to this section
Error message if there is an error

Example
Link to this section
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";

const {user, isLoading, error} = useKindeBrowserClient();

if (isLoading) return <div>Loading...</div>;

if (error) return <div>There was an error</div>;

return <div>Hello {user.given_name}</div>;

Returns
Link to this section
true

Protecting routes
Link to this section
It’s likely that your application will have both pages that are publicly available and private ones which should only be available to logged in users. There are multiple ways you can protect pages with Kinde Auth.

Protect routes with Kinde Auth data
Link to this section
On the page you want to protect, you can check if the user is authenticated and then handle it right then and there by grabbing the Kinde Auth data.

In Server Components you can get the Kinde Auth data by using the getKindeServerSession helper
In Client Components you can get the Kinde Auth Data using the useKindeBrowserClient helper
// app/protected/page.tsx - Server Component

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Protected() {
  const { isAuthenticated } = getKindeServerSession();

  return (await isAuthenticated()) ? (
    <div>
      This page is protected - but you can view it because you are authenticated
    </div>
  ) : (
    <div>
      This page is protected, please <LoginLink>Login</LoginLink> to view it
    </div>
  );
}

// app/protected/page.tsx - Client component
"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Admin() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div>Admin content</div>
  ) : (
    <div>
      You have to <LoginLink>Login</LoginLink> to see this page
    </div>
  );
}

In the example above, we show different content based on whether or not the user is authenticated. If you want to automatically send the user to the sign in screen, you can do something like the following:

// app/protected/page.tsx - Server Component

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from "next/navigation";

export default async function Protected() {
  const {isAuthenticated} = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  return <div>Protected content</div>;
}

// app/protected/page.tsx - Client Component

// As of right now, this can't be done in Client Components because of how Next.js handles
// navigation in client components with prefetching and caching.
// But you can still achieve an automatic redirect with middleware

If you want the user to be redirected back to that route after signing in, you can set post_login_redirect_url in the search params of the redirect.

if (!(await isAuthenticated())) {
  redirect("/api/auth/login?post_login_redirect_url=/protected");
}

Protect routes using middleware
Link to this section
You can also protect routes with Next.js middleware.

As of right now the middleware in the app router does not work when trying to redirect to api/auth/login. This is because of Next.js caching which causes issues during authentication.

Default page protection

We provide a withAuth helper that will protect routes covered by the matcher. If the user is not authenticated then they are redirected to login and once they have logged in they will be redirected back to the protected page which they should now have access to.

import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
export default function middleware(req) {
  return withAuth(req);
}
export const config = {
  matcher: ["/admin"]
};

Page protection with callback function after authorization

You can use the withAuth helper as shown below with a middleware callback function which has access to the req.kindeAuth object that exposes the token and user data.

import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware(req) {
  console.log("look at me", req.kindeAuth);
});

export const config = {
  matcher: ["/admin"]
};

Middleware options

There are options that can be passed into the middleware function to configure its functionality.

isReturnToCurrentPage - redirect the user back to the page they were trying to access
loginPage - define the path of the login page (where the users are redirected to when not authenticated)
publicPaths - define the public paths
isAuthorized - define the criteria for authorization
import {withAuth} from "@kinde-oss/kinde-auth-nextjs/middleware";
export default withAuth(
  async function middleware(req) {
    console.log("look at me", req.kindeAuth);
  },
  {
    isReturnToCurrentPage: true,
    loginPage: "/login",
    isAuthorized: ({token}) => {
      // The user will be considered authorized if they have the permission 'eat:chips'
      return token.permissions.includes("eat:chips");
    }
  }
);

export const config = {
  matcher: ["/admin"]
};

Refreshing Kinde data
Link to this section
Kinde data can be updated via the UI or with the Management API. To have these updates be reflected in your app, you will need to get the most up-to-date Kinde data and then refresh the tokens in your session.

To get the most up-to-date Kinde data in your session, use the refreshTokens helper function.

const {refreshTokens} = getKindeServerSession();

const handleRefresh = async () => {
  await refreshTokens();
}

...

<button onClick={handleRefresh}>Get up to date data</button>

Kinde Management API
Link to this section
You need to enable the application’s access to the Kinde Management API. You can do this in Kinde by going to Settings > APIs > Kinde Management API and then toggling on your Next.js application under the Applications tab.

To use our management API please see @kinde/management-api-js

Server Component example:

import { Roles, Users } from "@kinde/management-api-js";

export default async function Dashboard() {
  const { roles } = await Roles.getRoles();
  const { users } = await Users.getUsers();

  return (
    <div className="container">
      <div className="card start-hero">
        <p className="text-body-2 start-hero-intro">Woohoo!</p>
        <p className="text-display-2">
          Your authentication is all sorted.
          <br />
          Build the important stuff.
        </p>
      </div>
      <section className="next-steps-section">
        <h2 className="text-heading-1">Next steps for you</h2>
      </section>

      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

Route Handler example:

import {NextResponse} from "next/server";
import {Users} from "@kinde/management-api-js";

export async function GET() {
  const {users} = await Users.getUsers();

  return NextResponse.json({users});
}

Organizations
Link to this section
Create organizations
Link to this section
To create an organization from your app, you can use the CreateOrgLink component.

import {CreateOrgLink} from "@kinde-oss/kinde-auth-nextjs/components";

<CreateOrgLink orgName="Hurlstone">Create org</CreateOrgLink>;

Sign into organizations
Link to this section
You can have your users sign into a specific organization by setting the orgCode param in the LoginLink and RegisterLink components.

import {LoginLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/components";

<LoginLink orgCode="org_7392cf35a1e">Login</LoginLink>
<RegisterLink orgCode="org_7392cf35a1e">Register</RegisterLink>

If the orgCode is not specified and the user belongs to multiple organizations, they will be prompted to choose which organization to sign into during the login or register flow.

Analytics
Link to this section
UTM tags
Link to this section
UTM tags can be used with the LoginLink and RegisterLink components to track auth traffic from its origin. You can then track the tags on the Analytics dashboard from within the Kinde app.

import {LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

<LoginLink
  authUrlParams={{
    utm_source: "reddit",
    utm_medium: "social",
    utm_campaign: "redjune23",
    utm_term: "save90",
    utm_content: "desktop"
  }}
>
  Login
</LoginLink>;

Internationalization
Link to this section
You can set the language you wish your users to see when they hit the login flow by including the lang attribute as a part of the authUrlParams when using the LoginLink and RegisterLink components.

import {LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

<LoginLink
  authUrlParams={{
    lang: "en-AU"
  }}
>
  Login
</LoginLink>;

Audience
Link to this section
An audience is the intended recipient of an access token - for example the API for your application. The audience argument can be passed to the Kinde client to request an audience be added to the provided token.

.env.local
...
KINDE_AUDIENCE=<your-api>

You can request multiple audiences by providing a white space separated list

.env.local
...
KINDE_AUDIENCE=<your-api-1> <your-api-2>

For details on how to connect, see Register an API.

Working with subdomains
Link to this section
In the case you have a custom domain and you would like to start the authentication flow from a URL like auth.mysite.com and you want to redirect to a URL like app.mysite.com , all you have to do is set the KINDE_COOKIE_DOMAIN to match the domain.

.env
...
KINDE_COOKIE_DOMAIN=.mysite.com

If the URL you want to start the authentication flow from and the URL you want to redirect to don’t share the same domain, then this will not work.

Working with preview URLs
Link to this section
Our Kinde Next.js SDK currently requires that these environment variables KINDE_SITE_URL, KINDE_POST_LOGOUT_REDIRECT_URL, and KINDE_POST_LOGIN_REDIRECT_URL are defined, and that the callback URLs and logout redirect URLs are added to your app in Kinde.

To add Vercel’s dynamically generated URLs you can either securely use our API to add them on the fly or you can use wildcard URLs. It should be noted that whilst wildcards are more convenient it is not as secure as explicitly adding the url to the allowlist via API as we outline below.

Add the following to your next.config.js.

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    KINDE_SITE_URL: process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_URL}`,
    KINDE_POST_LOGOUT_REDIRECT_URL:
      process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? `https://${process.env.VERCEL_URL}`,
    KINDE_POST_LOGIN_REDIRECT_URL:
      process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? `https://${process.env.VERCEL_URL}/dashboard`
  }
};

module.exports = nextConfig;

This ensures Vercel uses its generated preview URLs to populate the three Kinde variables.

Make sure the above values match your application (e.g. “/dashboard” for KINDE_POST_LOGIN_REDIRECT_URL)
Also make sure variables are not set for the preview environment in your Vercel project. If they are, they will be overridden by the new variables in the next.config.js file.
Add callback URLs and logout redirect URLs to Kinde dynamically
Link to this section
Create a script that will run each time a new preview is deployed by Vercel, which will add the newly generated URL to Kinde.

Enable the Kinde Management API for your Next.js app.

In Kinde, go to Settings > Applications and open the Details of your application.
Select APIs in the left menu.
Switch on the Kinde Management API (if it is not on already).
Select Save.
In your application source code, create a folder at the top level called scripts.

Within that folder, create a file called add-urls-to-kinde.js and add the following code:

async function getAuthToken() {
  try {
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: new URLSearchParams({
        client_id: process.env.KINDE_CLIENT_ID,
        client_secret: process.env.KINDE_CLIENT_SECRET,
        grant_type: "client_credentials",
        audience: `${process.env.KINDE_ISSUER_URL}/api`
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw error;
  }
}

async function addLogoutUrlToKinde(token) {
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/applications/${process.env.KINDE_CLIENT_ID}/auth_logout_urls`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          urls: [`https://${process.env.VERCEL_URL}`]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add logout URL to Kinde: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`SUCCESS: Logout URL added to Kinde: ${process.env.VERCEL_URL}`, responseData);
  } catch (error) {
    console.error("Failed to add logout URL to Kinde", error);
    throw error;
  }
}

async function addCallbackUrlToKinde(token) {
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/applications/${process.env.KINDE_CLIENT_ID}/auth_redirect_urls`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          urls: [`https://${process.env.VERCEL_URL}/api/auth/kinde_callback`]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add callback URL to Kinde: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(
      `SUCCESS: Callback URL added to Kinde: ${process.env.VERCEL_URL}/api/auth/kinde_callback`,
      responseData
    );
  } catch (error) {
    console.error("Failed to add callback URL to Kinde", error);
    throw error;
  }
}

(async () => {
  if (process.env.VERCEL == 1) {
    try {
      const authToken = await getAuthToken();
      await addCallbackUrlToKinde(authToken);
      await addLogoutUrlToKinde(authToken);
    } catch (error) {
      console.error("Script failed:", error);
    }
  }
})();

In your package.json, add a postbuild script that will run the /scripts/add-urls-to-kinde.js file after Vercel builds your app.

"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postbuild": "node ./scripts/add-urls-to-kinde.js"
}

Commit these changes. The next deploy will add the newly created preview URLs to your Kinde application.

Health check
Link to this section
To check your configuration, the SDK exposes an endpoint with your settings.

Note: The client secret will indicate only if the secret is set or not set correctly.

/api/auth/health

{
  "apiPath": "/api/auth",
  "redirectURL": "http://localhost:3000/api/auth/kinde_callback",
  "postLoginRedirectURL": "http://localhost:3000/dashboard",
  "issuerURL": "https://<your_kinde_subdomain>.kinde.com",
  "clientID": "<your_kinde_client_id>",
  "clientSecret": "Set correctly",
  "postLogoutRedirectURL": "http://localhost:3000",
  "logoutRedirectURL": "http://localhost:3000"
}

Debug mode
Link to this section
In debug mode you will see more logs in your console that may help with debugging.

.env
KINDE_DEBUG_MODE = true;

Migration guide
Link to this section
Changes when moving from the previous version.

handleAuth - is now imported from “@kinde-oss/kinde-auth-nextjs/server”

import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
export const GET = handleAuth();

getKindeServerSession - functions returned from getKindeServerSession now return promises

const {getUser} = getKindeServerSession();
const user = await getUser();

Was this page helpful?
YesNo
Related articles
Next.js Pages Router SDK
SDKs and APIs

#### API Docs


Search
Kinde Management API v1
Authentication
OAuth
APIs
Applications
List Applications
Create Application
Get Application
Update Application
Delete Application
Get connections
Enable connection
Remove connection
Business
Industries
Timezones
Callbacks
Connected Apps
Connections
Environments
Feature Flags
Identities
Organizations
Permissions
Properties
Property Categories
Roles
Subscribers
Users
Webhooks
Schemas
Kinde Management API v1
Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

⚠️ Important Update ⚠️

Changes to M2M token requests to the Kinde Management API

You soon need to include scopes as part of token requests for all new M2M applications.

If you have existing M2M applications authorized to access the Kinde Management API, you remain unaffected until you add a new M2M application or add a new Kinde endpoint to an existing application.

For new M2M applications, you will need to define scopes as part of the app setup.

For existing applications (where you add a new endpoint), you will need to opt in to the relevant scopes.

All new Kinde Management API endpoints added from Wednesday (21 Aug 2024) require scopes.

Welcome to Kinde’s Management API docs

This is your library of API requests and responses.

If you haven’t already connected your app to our API, you’ll need to do these tasks first:

Add a machine to machine application for API access
Get access token for connecting
Test the connection — we show you how in Postman
Once you’re connected, you can browse the API library for what you need.

Base URLs

Make sure you use your own Kinde domain as the base URL wherever you see http://{businessName}.kinde.com.

To find this in Kinde, go to Settings > Applications > View details (on the relevant app) and copy it from the App keys > Domain field.

Need more help?

View all our docs

Reach out in the Kinde community on Slack

Email support@kinde.com

Authentication
To access endpoints in the API, you need to go through the three set up steps above.

To access the OAuth endpoint, use the token obtained when your users sign in via the methods you've setup in Kinde (e.g. google, passwordless, etc). Find this using the getToken command in the relevant SDK.

OAuth
Get User Profile

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/oauth2/user_profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /oauth2/user_profile

Contains the id, names and email of the currently logged in user.

Example responses

200 Response

{
  "id": "string",
  "preferred_email": "string",
  "username": "string",
  "provided_id": "string",
  "last_name": "string",
  "first_name": "string",
  "picture": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Details of logged in user V1.	user_profile
403	Forbidden	Invalid credentials.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get token details

Code samples

const inputBody = '{
  "token": "string",
  "token_type": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/oauth2/introspect',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /oauth2/introspect

Retrieve information about the provided token.

Body parameter

token: string
token_type: string

Parameters
Name	In	Type	Required	Description
body	body	object	true	Token details.
» token	body	string	false	The token to be introspected.
» token_type	body	string	false	The provided token's type.
Example responses

200 Response

{
  "active": true,
  "aud": [
    "string"
  ],
  "client_id": "string",
  "exp": "string",
  "iat": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Details of the token.	token_introspect
401	Unauthorized	Bad request.	token_error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Revoke token

Code samples

const inputBody = '{
  "token": "string",
  "client_id": "string",
  "client_secret": "string"
}';
const headers = {
  'Content-Type':'application/x-www-form-urlencoded',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/oauth2/revoke',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /oauth2/revoke

Revoke a previously issued token.

Body parameter

token: string
client_id: string
client_secret: string

Parameters
Name	In	Type	Required	Description
body	body	object	true	Details of the token to be revoked.
» token	body	string	false	The token to be revoked.
» client_id	body	string	false	The identifier for your client.
» client_secret	body	string	false	The secret associated with your client.
Example responses

401 Response

{
  "error": "string",
  "error_description": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Token successfully revoked.	None
401	Unauthorized	Bad request.	token_error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Returns the details of the currently logged in user

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/oauth2/v2/user_profile',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /oauth2/v2/user_profile

Contains the id, names, profile picture URL and email of the currently logged in user.

Example responses

200 Response

{
  "id": "string",
  "sub": "string",
  "provided_id": "string",
  "name": "string",
  "given_name": "string",
  "family_name": "string",
  "updated_at": 0,
  "email": "string",
  "picture": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Details of logged in user V2.	user_profile_v2
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
APIs
List APIs

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/apis',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/apis

Returns a list of APIs.

Example responses

200 Response

{
  "id": "string",
  "name": "string",
  "audience": "string",
  "is_management_api": true
}
Responses
Status	Meaning	Description	Schema
200	OK	APIs successfully retrieved.	apis
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Add APIs

Code samples

const inputBody = '{
  "name": "string",
  "audience": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/apis',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/apis

Add APIs.

Body parameter

{
  "name": "string",
  "audience": "string"
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	API details.
» name	body	string	true	none
» audience	body	string	true	none
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	APIs successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List API details

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/apis/{api_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/apis/{api_id}

Returns the details of the API.

Parameters
Name	In	Type	Required	Description
api_id	path	string	true	The API's id.
Example responses

200 Response

{
  "id": "string",
  "code": "string",
  "name": "string",
  "message": "string",
  "audience": "string",
  "applications": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "is_active": true
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	API successfully retrieved.	api
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete API

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/apis/{api_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/apis/{api_id}

Deletes API.

Parameters
Name	In	Type	Required	Description
api_id	path	string	true	The API's id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	API successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update API Applications

Code samples

const inputBody = '{
  "applications": [
    {
      "id": "string",
      "operation": "string"
    }
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/apis/{api_id}/applications',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/apis/{api_id}/applications

Update the applications under that API.

Body parameter

{
  "applications": [
    {
      "id": "string",
      "operation": "string"
    }
  ]
}
Parameters
Name	In	Type	Required	Description
api_id	path	string	true	The identifier for the API.
body	body	object	true	The applications you want to connect or disconnect.
» applications	body	[object]	true	none
»» id	body	string	true	The application's id.
»» operation	body	string	false	Optional operation, set to 'delete' to remove the user from the organization.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	API applications updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Applications
List Applications

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/applications

Get a list of applications.

Parameters
Name	In	Type	Required	Description
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "applications": [
    {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	A successful response with a list of applications or an empty list.	get_applications_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Application

Code samples

const inputBody = '{
  "name": "string",
  "type": "reg"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/applications

Create an application.

Body parameter

{
  "name": "string",
  "type": "reg"
}
Parameters
Name	In	Type	Required	Description
body	body	object	false	Application details.
» name	body	string	false	The application's name.
» type	body	string	false	The application's type.
Enumerated Values
Parameter	Value
» type	reg
» type	spa
» type	m2m
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "application": {
    "id": "string",
    "client_id": "string",
    "client_secret": "string"
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Application successfully created.	create_application_response
400	Bad Request	Error creating user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get Application

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{application_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/applications/{application_id}

Gets an application given the application's id.

Parameters
Name	In	Type	Required	Description
application_id	path	string	true	The identifier for the application.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "application": {
    "id": "string",
    "name": "string",
    "type": "string",
    "client_id": "string",
    "client_secret": "string",
    "login_uri": "string",
    "homepage_uri": "string"
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Application successfully retrieved.	get_application_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Application

Code samples

const inputBody = '{
  "name": "string",
  "language_key": "string",
  "logout_uris": [
    "string"
  ],
  "redirect_uris": [
    "string"
  ],
  "login_uri": "string",
  "homepage_uri": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{application_id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/applications/{application_id}

Update an application.

Body parameter

{
  "name": "string",
  "language_key": "string",
  "logout_uris": [
    "string"
  ],
  "redirect_uris": [
    "string"
  ],
  "login_uri": "string",
  "homepage_uri": "string"
}
Parameters
Name	In	Type	Required	Description
application_id	path	string	true	The identifier for the application.
body	body	object	false	Application details.
» name	body	string	false	The application's name.
» language_key	body	string	false	The application's language key.
» logout_uris	body	[string]	false	The application's logout uris.
» redirect_uris	body	[string]	false	The application's redirect uris.
» login_uri	body	string	false	The default login route for resolving session issues.
» homepage_uri	body	string	false	The homepage link to your application.
Example responses

400 Response

{
  "errors": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Application successfully updated.	None
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Application

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{application_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/applications/{application_id}

Delete application.

Parameters
Name	In	Type	Required	Description
application_id	path	string	true	The identifier for the application.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Application successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get connections

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{application_id}/connections',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/applications/{application_id}/connections

Gets all connections for an application.

Parameters
Name	In	Type	Required	Description
application_id	path	string	true	The identifier/client ID for the application.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "connections": [
    {
      "id": "string",
      "name": "string",
      "display_name": "string",
      "strategy": "string"
    }
  ],
  "has_more": true
}
Responses
Status	Meaning	Description	Schema
200	OK	Application connections successfully retrieved.	get_connections_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Enable connection

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{application_id}/connections/{connection_id}',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/applications/{application_id}/connections/{connection_id}

Enable an auth connection for an application.

Parameters
Name	In	Type	Required	Description
application_id	path	string	true	The identifier/client ID for the application.
connection_id	path	string	true	The identifier for the connection.
Example responses

400 Response

{
  "errors": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Connection successfully enabled.	None
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Remove connection

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{application_id}/connections/{connection_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/applications/{application_id}/connections/{connection_id}

Turn off an auth connection for an application

Parameters
Name	In	Type	Required	Description
application_id	path	string	true	The identifier/client ID for the application.
connection_id	path	string	true	The identifier for the connection.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Connection successfully removed.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Business
List business details

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/business?code=string&name=string&email=string',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/business

Get your business details.

Parameters
Name	In	Type	Required	Description
code	query	string	true	Business code.
name	query	string	true	Business name.
email	query	string	true	Email associated with business.
phone	query	string	false	Phone number associated with business.
industry	query	string	false	The industry your business is in.
timezone	query	string	false	The timezone your business is in.
privacy_url	query	string	false	Your Privacy policy URL.
terms_url	query	string	false	Your Terms and Conditions URL.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	A successful response with your business details.	success_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update business details

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/business?business_name=string&primary_email=string',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/business

Update business details.

Parameters
Name	In	Type	Required	Description
business_name	query	string	true	Business name.
primary_email	query	string	true	Email associated with business.
primary_phone	query	string	false	Phone number associated with business.
industry_key	query	string	false	The key of the industry your business is in.
timezone_id	query	string	false	The ID of the timezone your business is in.
privacy_url	query	string	false	Your Privacy policy URL.
terms_url	query	string	false	Your Terms and Conditions URL.
is_show_kinde_branding	query	string	false	Display "Powered by Kinde" on your sign up, sign in, and subscription pages.
is_click_wrap	query	boolean	false	Show a policy acceptance checkbox on sign up.
partner_code	query	string	false	Your Kinde Perk code.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	Business successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Industries
List industries and industry keys.

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/industries',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/industries

Get a list of industries and associated industry keys.

Parameters
Name	In	Type	Required	Description
industry_key	query	string	false	Industry Key.
name	query	string	false	Industry name.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	A successful response with a list of industries and industry keys.	success_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Timezones
List timezones and timezone IDs.

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/timezones',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/timezones

Get a list of timezones and associated timezone keys.

Parameters
Name	In	Type	Required	Description
timezone_key	query	string	false	Timezone Key.
name	query	string	false	Timezone.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	A successful response with a list of timezones and timezone keys.	success_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Callbacks
List Callback URLs

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_redirect_urls',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/applications/{app_id}/auth_redirect_urls

Returns an application's redirect callback URLs.

Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
Example responses

200 Response

{
  "redirect_urls": [
    "string"
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Callback URLs successfully retrieved.	redirect_callback_urls
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Add Redirect Callback URLs

Code samples

const inputBody = '{
  "urls": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_redirect_urls',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/applications/{app_id}/auth_redirect_urls

Add additional redirect callback URLs.

Body parameter

{
  "urls": [
    "string"
  ]
}
Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
body	body	object	true	Callback details.
» urls	body	[string]	false	Array of callback urls.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Callbacks successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Replace Redirect Callback URLs

Code samples

const inputBody = '{
  "urls": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_redirect_urls',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/applications/{app_id}/auth_redirect_urls

Replace all redirect callback URLs.

Body parameter

{
  "urls": [
    "string"
  ]
}
Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
body	body	object	true	Callback details.
» urls	body	[string]	false	Array of callback urls.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Callbacks successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Callback URLs

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_redirect_urls?urls=string',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/applications/{app_id}/auth_redirect_urls

Delete callback URLs.

Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
urls	query	string	true	Urls to delete, comma separated and url encoded.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Callback URLs successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Logout URLs

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_logout_urls',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/applications/{app_id}/auth_logout_urls

Returns an application's logout redirect URLs.

Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
Example responses

200 Response

{
  "redirect_urls": [
    "string"
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Logout URLs successfully retrieved.	logout_redirect_urls
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Add Logout Redirect URLs

Code samples

const inputBody = '{
  "urls": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_logout_urls',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/applications/{app_id}/auth_logout_urls

Add additional logout redirect URLs.

Body parameter

{
  "urls": [
    "string"
  ]
}
Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
body	body	object	true	Callback details.
» urls	body	[string]	false	Array of logout urls.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Logouts successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Replace Logout Redirect URLs

Code samples

const inputBody = '{
  "urls": [
    "string"
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_logout_urls',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/applications/{app_id}/auth_logout_urls

Replace all logout redirect URLs.

Body parameter

{
  "urls": [
    "string"
  ]
}
Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
body	body	object	true	Callback details.
» urls	body	[string]	false	Array of logout urls.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Logout URLs successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Logout URLs

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/applications/{app_id}/auth_logout_urls?urls=string',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/applications/{app_id}/auth_logout_urls

Delete logout URLs.

Parameters
Name	In	Type	Required	Description
app_id	path	string	true	The identifier for the application.
urls	query	string	true	Urls to delete, comma separated and url encoded.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Logout URLs successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Connected Apps
Get Connected App URL

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connected_apps/auth_url?key_code_ref=string',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/connected_apps/auth_url

Get a URL that authenticates and authorizes a user to a third-party connected app.

Parameters
Name	In	Type	Required	Description
key_code_ref	query	string	true	The unique key code reference of the connected app to authenticate against.
user_id	query	string	false	The id of the user that needs to authenticate to the third-party connected app.
org_code	query	string	false	The code of the Kinde organization that needs to authenticate to the third-party connected app.
override_callback_url	query	string	false	A URL that overrides the default callback URL setup in your connected app configuration
Example responses

200 Response

{
  "url": "string",
  "session_id": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	A URL that can be used to authenticate and a session id to identify this authentication session.	connected_apps_auth_url
400	Bad Request	Error retrieving connected app auth url.	error_response
403	Forbidden	Invalid credentials.	None
404	Not Found	Error retrieving connected app auth url.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get Connected App Token

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connected_apps/token?session_id=string',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/connected_apps/token

Get an access token that can be used to call the third-party provider linked to the connected app.

Parameters
Name	In	Type	Required	Description
session_id	query	string	true	The unique sesssion id representing the login session of a user.
Example responses

200 Response

{
  "access_token": "string",
  "access_token_expiry": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	An access token that can be used to query a third-party provider, as well as the token's expiry time.	connected_apps_access_token
400	Bad Request	The session id provided points to an invalid session.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Revoke Connected App Token

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connected_apps/revoke?session_id=string',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/connected_apps/revoke

Revoke the tokens linked to the connected app session.

Parameters
Name	In	Type	Required	Description
session_id	query	string	true	The unique sesssion id representing the login session of a user.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	An access token that can be used to query a third-party provider, as well as the token's expiry time.	success_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	error_response
405	Method Not Allowed	Invalid HTTP method used.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Connections
List Connections

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connections',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/connections

Returns a list of Connections

Parameters
Name	In	Type	Required	Description
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
starting_after	query	string	false	The ID of the connection to start after.
ending_before	query	string	false	The ID of the connection to end before.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "connections": [
    {
      "id": "string",
      "name": "string",
      "display_name": "string",
      "strategy": "string"
    }
  ],
  "has_more": true
}
Responses
Status	Meaning	Description	Schema
200	OK	Connections successfully retrieved.	get_connections_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Connection

Code samples

const inputBody = '{
  "name": "string",
  "display_name": "string",
  "strategy": "oauth2:apple",
  "enabled_applications": [
    "string"
  ],
  "options": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connections',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/connections

Create Connection.

Body parameter

{
  "name": "string",
  "display_name": "string",
  "strategy": "oauth2:apple",
  "enabled_applications": [
    "string"
  ],
  "options": {}
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Connection details.
» name	body	string	true	The internal name of the connection.
» display_name	body	string	true	The public facing name of the connection.
» strategy	body	string	true	The identity provider identifier for the connection.
» enabled_applications	body	[string]	false	Client IDs of applications in which this connection is to be enabled.
» options	body	object	false	The connection's options (varies by strategy).
Enumerated Values
Parameter	Value
» strategy	oauth2:apple
» strategy	oauth2:azure_ad
» strategy	oauth2:bitbucket
» strategy	oauth2:discord
» strategy	oauth2:facebook
» strategy	oauth2:github
» strategy	oauth2:gitlab
» strategy	oauth2:google
» strategy	oauth2:linkedin
» strategy	oauth2:microsoft
» strategy	oauth2:patreon
» strategy	oauth2:slack
» strategy	oauth2:stripe
» strategy	oauth2:twitch
» strategy	oauth2:twitter
» strategy	oauth2:xero
» strategy	saml:custom
» strategy	wsfed:azure_ad
Example responses

201 Response

{
  "message": "string",
  "code": "string",
  "connection": {
    "id": "string"
  }
}
Responses
Status	Meaning	Description	Schema
201	Created	Connection successfully created	create_connection_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get Connection

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connections/{connection_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/connections/{connection_id}

Get Connection.

Parameters
Name	In	Type	Required	Description
connection_id	path	string	true	The unique identifier for the connection.
Example responses

200 Response

{
  "id": "string",
  "name": "string",
  "display_name": "string",
  "strategy": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Connection successfully retrieved.	connection
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Connection

Code samples

const inputBody = '{
  "name": "string",
  "display_name": "string",
  "enabled_applications": [
    "string"
  ],
  "options": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connections/{connection_id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/connections/{connection_id}

Update Connection.

Body parameter

{
  "name": "string",
  "display_name": "string",
  "enabled_applications": [
    "string"
  ],
  "options": {}
}
Parameters
Name	In	Type	Required	Description
connection_id	path	string	true	The unique identifier for the connection.
body	body	object	true	The fields of the connection to update.
» name	body	string	false	The internal name of the connection.
» display_name	body	string	false	The public facing name of the connection.
» enabled_applications	body	[string]	false	Client IDs of applications in which this connection is to be enabled.
» options	body	object	false	The connection's options (varies by strategy).
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Connection successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Connection

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/connections/{connection_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/connections/{connection_id}

Delete connection.

Parameters
Name	In	Type	Required	Description
connection_id	path	string	true	The identifier for the connection.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Connection deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Environments
Delete Environment Feature Flag Overrides

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/environment/feature_flags',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/environment/feature_flags

Delete all environment feature flag overrides.

Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag overrides deleted successfully.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Environment Feature Flags

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/environment/feature_flags',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/environment/feature_flags

Get environment feature flags.

Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "feature_flags": {
    "property1": {
      "type": "str",
      "value": "string"
    },
    "property2": {
      "type": "str",
      "value": "string"
    }
  },
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flags retrieved successfully.	get_environment_feature_flags_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Environment Feature Flag Override

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/environment/feature_flags/{feature_flag_key}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/environment/feature_flags/{feature_flag_key}

Delete environment feature flag override.

Parameters
Name	In	Type	Required	Description
feature_flag_key	path	string	true	The identifier for the feature flag.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag deleted successfully.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Environment Feature Flag Override

Code samples

const inputBody = '{
  "value": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/environment/feature_flags/{feature_flag_key}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/environment/feature_flags/{feature_flag_key}

Update environment feature flag override.

Body parameter

{
  "value": "string"
}
Parameters
Name	In	Type	Required	Description
feature_flag_key	path	string	true	The identifier for the feature flag.
body	body	object	true	Flag details.
» value	body	string	true	The flag override value.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag override successful	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Feature Flags
Create Feature Flag

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "key": "string",
  "type": "str",
  "allow_override_level": "env",
  "default_value": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/feature_flags',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/feature_flags

Create feature flag.

Body parameter

{
  "name": "string",
  "description": "string",
  "key": "string",
  "type": "str",
  "allow_override_level": "env",
  "default_value": "string"
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Flag details.
» name	body	string	true	The name of the flag.
» description	body	string	false	Description of the flag purpose.
» key	body	string	true	The flag identifier to use in code.
» type	body	string	true	The variable type.
» allow_override_level	body	string	false	Allow the flag to be overridden at a different level.
» default_value	body	string	true	Default value for the flag used by environments and organizations.
Enumerated Values
Parameter	Value
» type	str
» type	int
» type	bool
» allow_override_level	env
» allow_override_level	org
» allow_override_level	usr
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	Feature flag successfully created	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Feature Flag

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/feature_flags/{feature_flag_key}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/feature_flags/{feature_flag_key}

Delete feature flag

Parameters
Name	In	Type	Required	Description
feature_flag_key	path	string	true	The identifier for the feature flag.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Replace Feature Flag

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/feature_flags/{feature_flag_key}?name=string&description=string&type=str&allow_override_level=env&default_value=string',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/feature_flags/{feature_flag_key}

Update feature flag.

Parameters
Name	In	Type	Required	Description
feature_flag_key	path	string	true	The key identifier for the feature flag.
name	query	string	true	The name of the flag.
description	query	string	true	Description of the flag purpose.
type	query	string	true	The variable type
allow_override_level	query	string	true	Allow the flag to be overridden at a different level.
default_value	query	string	true	Default value for the flag used by environments and organizations.
Enumerated Values
Parameter	Value
type	str
type	int
type	bool
allow_override_level	env
allow_override_level	org
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Identities
Get identity

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/identities/{identity_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/identities/{identity_id}

Returns an identity by ID

Parameters
Name	In	Type	Required	Description
identity_id	path	string	true	The unique identifier for the identity.
Example responses

200 Response

{
  "id": "string",
  "type": "string",
  "is_confirmed": true,
  "created_on": "string",
  "last_login_on": "string",
  "total_logins": 0,
  "name": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Identity successfully retrieved.	identity
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update identity

Code samples

const inputBody = '{
  "is_primary": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/identities/{identity_id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/identities/{identity_id}

Update identity by ID.

Body parameter

{
  "is_primary": true
}
Parameters
Name	In	Type	Required	Description
identity_id	path	string	true	The unique identifier for the identity.
body	body	object	true	The fields of the identity to update.
» is_primary	body	boolean	false	Whether the identity is the primary for it's type
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Identity successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete identity

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/identities/{identity_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/identities/{identity_id}

Delete identity by ID.

Parameters
Name	In	Type	Required	Description
identity_id	path	string	true	The unique identifier for the identity.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Identity successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Organizations
Get Organization

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organization',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organization

Gets an organization given the organization's code.

Parameters
Name	In	Type	Required	Description
code	query	string	false	The organization's code.
Example responses

200 Response

{
  "code": "string",
  "name": "string",
  "is_default": true,
  "external_id": "string",
  "logo": "string",
  "link_color": "string",
  "button_color": "string",
  "background_color": "string",
  "button_text_color": "string",
  "is_allow_registrations": true
}
Responses
Status	Meaning	Description	Schema
200	OK	Organization successfully retrieved.	organization
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Organization

Code samples

const inputBody = '{
  "name": "string",
  "feature_flags": {
    "property1": "str",
    "property2": "str"
  },
  "external_id": "string",
  "background_color": "string",
  "button_color": "string",
  "button_text_color": "string",
  "link_color": "string",
  "background_color_dark": "string",
  "button_color_dark": "string",
  "button_text_color_dark": "string",
  "link_color_dark": "string",
  "theme_code": "string",
  "handle": "string",
  "is_allow_registrations": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organization',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/organization

Create an organization.

Body parameter

{
  "name": "string",
  "feature_flags": {
    "property1": "str",
    "property2": "str"
  },
  "external_id": "string",
  "background_color": "string",
  "button_color": "string",
  "button_text_color": "string",
  "link_color": "string",
  "background_color_dark": "string",
  "button_color_dark": "string",
  "button_text_color_dark": "string",
  "link_color_dark": "string",
  "theme_code": "string",
  "handle": "string",
  "is_allow_registrations": true
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Organization details.
» name	body	string	true	The organization's name.
» feature_flags	body	object	false	The organization's feature flag settings.
»» additionalProperties	body	string	false	Value of the feature flag.
» external_id	body	string	false	The organization's ID.
» background_color	body	string	false	The organization's brand settings - background color.
» button_color	body	string	false	The organization's brand settings - button color.
» button_text_color	body	string	false	The organization's brand settings - button text color.
» link_color	body	string	false	The organization's brand settings - link color.
» background_color_dark	body	string	false	The organization's brand settings - dark mode background color.
» button_color_dark	body	string	false	The organization's brand settings - dark mode button color.
» button_text_color_dark	body	string	false	The organization's brand settings - dark mode button text color.
» link_color_dark	body	string	false	The organization's brand settings - dark mode link color.
» theme_code	body	string	false	The organization's brand settings - theme/mode 'light'
» handle	body	string	false	The organization's handle.
» is_allow_registrations	body	boolean	false	Users can sign up to this organization.
Enumerated Values
Parameter	Value
»» additionalProperties	str
»» additionalProperties	int
»» additionalProperties	bool
Example responses

200 Response

{
  "message": "string",
  "code": "string",
  "organization": {
    "code": "string"
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Organization successfully created.	create_organization_response
400	Bad Request	Error creating user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
500	Internal Server Error	Could not create organization.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Organization

Code samples

const inputBody = '{
  "name": "string",
  "external_id": "string",
  "background_color": "string",
  "button_color": "string",
  "button_text_color": "string",
  "link_color": "string",
  "background_color_dark": "string",
  "button_color_dark": "string",
  "button_text_color_dark": "string",
  "link_color_dark": "string",
  "theme_code": "string",
  "handle": "string",
  "is_allow_registrations": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organization/{org_code}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/organization/{org_code}

Update an organization.

Body parameter

{
  "name": "string",
  "external_id": "string",
  "background_color": "string",
  "button_color": "string",
  "button_text_color": "string",
  "link_color": "string",
  "background_color_dark": "string",
  "button_color_dark": "string",
  "button_text_color_dark": "string",
  "link_color_dark": "string",
  "theme_code": "string",
  "handle": "string",
  "is_allow_registrations": true
}
Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization.
body	body	object	false	Organization details.
» name	body	string	false	The organization's name.
» external_id	body	string	false	The organization's ID.
» background_color	body	string	false	The organization's brand settings - background color.
» button_color	body	string	false	The organization's brand settings - button color.
» button_text_color	body	string	false	The organization's brand settings - button text color.
» link_color	body	string	false	The organization's brand settings - link color.
» background_color_dark	body	string	false	The organization's brand settings - dark mode background color.
» button_color_dark	body	string	false	The organization's brand settings - dark mode button color.
» button_text_color_dark	body	string	false	The organization's brand settings - dark mode button text color.
» link_color_dark	body	string	false	The organization's brand settings - dark mode link color.
» theme_code	body	string	false	The organization's brand settings - theme/mode 'light'
» handle	body	string	false	The organization's handle.
» is_allow_registrations	body	boolean	false	Users can sign up to this organization.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Organization successfully updated.	success_response
400	Bad Request	Error updating organization.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Organization

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organization/{org_code}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organization/{org_code}

Delete an organization.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization.
Example responses

400 Response

{
  "errors": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Organization successfully deleted.	None
400	Bad Request	Error deleting organization.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Organizations

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organizations

Get a list of organizations.

Parameters
Name	In	Type	Required	Description
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
sort	email_asc
sort	email_desc
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "organizations": [
    {
      "code": "string",
      "name": "string",
      "is_default": true,
      "external_id": "string",
      "logo": "string",
      "link_color": "string",
      "button_color": "string",
      "background_color": "string",
      "button_text_color": "string",
      "is_allow_registrations": true
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	A successful response with a list of organizations or an empty list.	get_organizations_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Organization Users

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organizations/{org_code}/users

Get users in an organization.

Parameters
Name	In	Type	Required	Description
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
org_code	path	string	true	The organization's code.
permissions	query	string	false	Filter by user permissions comma separated (where all match)
roles	query	string	false	Filter by user roles comma separated (where all match)
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
sort	email_asc
sort	email_desc
sort	id_asc
sort	id_desc
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "organization_users": [
    {
      "id": "string",
      "email": "string",
      "full_name": "string",
      "last_name": "string",
      "first_name": "string",
      "picture": "string",
      "roles": [
        "string"
      ]
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	A successful response with a list of organization users or an empty list.	get_organization_users_response
400	Bad Request	Error creating user	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Add Organization Users

Code samples

const inputBody = '{
  "users": [
    {
      "id": "string",
      "roles": [
        "string"
      ],
      "permissions": [
        "string"
      ]
    }
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/organizations/{org_code}/users

Add existing users to an organization.

Body parameter

{
  "users": [
    {
      "id": "string",
      "roles": [
        "string"
      ],
      "permissions": [
        "string"
      ]
    }
  ]
}
Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
body	body	object	false	none
» users	body	[object]	false	Users to be added to the organization.
»» id	body	string	false	The users id.
»» roles	body	[string]	false	Role keys to assign to the user.
»» permissions	body	[string]	false	Permission keys to assign to the user.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "users_added": [
    "string"
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Users successfully added.	add_organization_users_response
204	No Content	No users added.	None
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Organization Users

Code samples

const inputBody = '{
  "users": [
    {
      "id": "string",
      "operation": "string",
      "roles": [
        "string"
      ],
      "permissions": [
        "string"
      ]
    }
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/organizations/{org_code}/users

Update users that belong to an organization.

Body parameter

{
  "users": [
    {
      "id": "string",
      "operation": "string",
      "roles": [
        "string"
      ],
      "permissions": [
        "string"
      ]
    }
  ]
}
Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
body	body	object	false	none
» users	body	[object]	false	Users to add, update or remove from the organization.
»» id	body	string	false	The users id.
»» operation	body	string	false	Optional operation, set to 'delete' to remove the user from the organization.
»» roles	body	[string]	false	Role keys to assign to the user.
»» permissions	body	[string]	false	Permission keys to assign to the user.
Example responses

200 Response

{
  "message": "string",
  "users_added": [
    "string"
  ],
  "users_updated": [
    "string"
  ],
  "users_removed": [
    "string"
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Users successfully removed.	update_organization_users_response
400	Bad Request	Error updating organization user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Organization User Roles

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}/roles',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organizations/{org_code}/users/{user_id}/roles

Get roles for an organization user.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "roles": [
    {
      "id": "string",
      "key": "string",
      "name": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	A successful response with a list of user roles.	get_organizations_user_roles_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Add Organization User Role

Code samples

const inputBody = '{
  "role_id": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}/roles',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/organizations/{org_code}/users/{user_id}/roles

Add role to an organization user.

Body parameter

{
  "role_id": "string"
}
Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
body	body	object	true	Role details.
» role_id	body	string	false	The role id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Role successfully added.	success_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Organization User Role

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}/roles/{role_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organizations/{org_code}/users/{user_id}/roles/{role_id}

Delete role for an organization user.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
role_id	path	string	true	The role id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully removed.	success_response
400	Bad Request	Error creating user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Organization User Permissions

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}/permissions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organizations/{org_code}/users/{user_id}/permissions

Get permissions for an organization user.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
expand	query	string	false	Specify additional data to retrieve. Use "roles".
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "permissions": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "description": "string",
      "roles": [
        {
          "id": "string",
          "key": "string"
        }
      ]
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	A successful response with a list of user permissions.	get_organizations_user_permissions_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Add Organization User Permission

Code samples

const inputBody = '{
  "permission_id": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}/permissions',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/organizations/{org_code}/users/{user_id}/permissions

Add permission to an organization user.

Body parameter

{
  "permission_id": "string"
}
Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
body	body	object	true	Permission details.
» permission_id	body	string	false	The permission id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User permission successfully updated.	success_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Organization User Permission

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}/permissions/{permission_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organizations/{org_code}/users/{user_id}/permissions/{permission_id}

Delete permission for an organization user.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
permission_id	path	string	true	The permission id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully removed.	success_response
400	Bad Request	Error creating user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Remove Organization User

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/users/{user_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organizations/{org_code}/users/{user_id}

Remove user from an organization.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
user_id	path	string	true	The user's id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully removed from organization	success_response
400	Bad Request	Error removing user	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Organization Feature Flags

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/feature_flags',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organizations/{org_code}/feature_flags

Get all organization feature flags.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "feature_flags": {
    "property1": {
      "type": "str",
      "value": "string"
    },
    "property2": {
      "type": "str",
      "value": "string"
    }
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag overrides successfully returned.	get_organization_feature_flags_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Organization Feature Flag Overrides

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/feature_flags',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organizations/{org_code}/feature_flags

Delete all organization feature flag overrides.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag overrides successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Organization Feature Flag Override

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/feature_flags/{feature_flag_key}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organizations/{org_code}/feature_flags/{feature_flag_key}

Delete organization feature flag override.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization.
feature_flag_key	path	string	true	The identifier for the feature flag.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag override successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Organization Feature Flag Override

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/feature_flags/{feature_flag_key}?value=string',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/organizations/{org_code}/feature_flags/{feature_flag_key}

Update organization feature flag override.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization
feature_flag_key	path	string	true	The identifier for the feature flag
value	query	string	true	Override value
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag override successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Organization Property value

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/properties/{property_key}?value=string',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/organizations/{org_code}/properties/{property_key}

Update organization property value.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization
property_key	path	string	true	The identifier for the property
value	query	string	true	The new property value
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Property successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get Organization Property Values

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/properties',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/organizations/{org_code}/properties

Gets properties for an organization by org code.

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "key": "string",
      "value": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Properties successfully retrieved.	get_property_values_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Organization Property values

Code samples

const inputBody = '{
  "properties": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organizations/{org_code}/properties',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/organizations/{org_code}/properties

Update organization property values.

Body parameter

{
  "properties": {}
}
Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The identifier for the organization
body	body	object	true	Properties to update.
» properties	body	object	true	Property keys and values
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Properties successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete organization handle

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/organization/{org_code}/handle',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/organization/{org_code}/handle

Delete organization handle

Parameters
Name	In	Type	Required	Description
org_code	path	string	true	The organization's code.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Handle successfully deleted.	success_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Permissions
List Permissions

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/permissions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/permissions

The returned list can be sorted by permission name or permission ID in ascending or descending order. The number of records to return at a time can also be controlled using the page_size query string parameter.

Parameters
Name	In	Type	Required	Description
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
sort	id_asc
sort	id_desc
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "permissions": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Permissions successfully retrieved.	get_permissions_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Permission

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "key": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/permissions',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/permissions

Create a new permission.

Body parameter

{
  "name": "string",
  "description": "string",
  "key": "string"
}
Parameters
Name	In	Type	Required	Description
body	body	object	false	Permission details.
» name	body	string	false	The permission's name.
» description	body	string	false	The permission's description.
» key	body	string	false	The permission identifier to use in code.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	Permission successfully created	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Permission

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "key": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/permissions/{permission_id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/permissions/{permission_id}

Update permission

Body parameter

{
  "name": "string",
  "description": "string",
  "key": "string"
}
Parameters
Name	In	Type	Required	Description
permission_id	path	integer	true	The identifier for the permission.
body	body	object	false	Permission details.
» name	body	string	false	The permission's name.
» description	body	string	false	The permission's description.
» key	body	string	false	The permission identifier to use in code.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	Permission successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Permission

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/permissions/{permission_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/permissions/{permission_id}

Delete permission

Parameters
Name	In	Type	Required	Description
permission_id	path	string	true	The identifier for the permission.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	permission successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Properties
List properties

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/properties',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/properties

Returns a list of properties

Parameters
Name	In	Type	Required	Description
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
starting_after	query	string	false	The ID of the property to start after.
ending_before	query	string	false	The ID of the property to end before.
context	query	string	false	Filter results by User or Organization context
Enumerated Values
Parameter	Value
context	usr
context	org
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "is_private": true,
      "description": "string",
      "is_kinde_property": true
    }
  ],
  "has_more": true
}
Responses
Status	Meaning	Description	Schema
200	OK	Properties successfully retrieved.	get_properties_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Property

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "key": "string",
  "type": "single_line_text",
  "context": "org",
  "is_private": true,
  "category_id": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/properties',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/properties

Create property.

Body parameter

{
  "name": "string",
  "description": "string",
  "key": "string",
  "type": "single_line_text",
  "context": "org",
  "is_private": true,
  "category_id": "string"
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Property details.
» name	body	string	true	The name of the property.
» description	body	string	false	Description of the property purpose.
» key	body	string	true	The property identifier to use in code.
» type	body	string	true	The property type.
» context	body	string	true	The context that the property applies to.
» is_private	body	boolean	true	Whether the property can be included in id and access tokens.
» category_id	body	string	true	Which category the property belongs to.
Enumerated Values
Parameter	Value
» type	single_line_text
» type	multi_line_text
» context	org
» context	usr
Example responses

201 Response

{
  "message": "string",
  "code": "string",
  "property": {
    "id": "string"
  }
}
Responses
Status	Meaning	Description	Schema
201	Created	Property successfully created	create_property_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Property

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "is_private": true,
  "category_id": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/properties/{property_id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/properties/{property_id}

Update property.

Body parameter

{
  "name": "string",
  "description": "string",
  "is_private": true,
  "category_id": "string"
}
Parameters
Name	In	Type	Required	Description
property_id	path	string	true	The unique identifier for the property.
body	body	object	true	The fields of the property to update.
» name	body	string	true	The name of the property.
» description	body	string	false	Description of the property purpose.
» is_private	body	boolean	true	Whether the property can be included in id and access tokens.
» category_id	body	string	true	Which category the property belongs to.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Property successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Property

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/properties/{property_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/properties/{property_id}

Delete property.

Parameters
Name	In	Type	Required	Description
property_id	path	string	true	The unique identifier for the property.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Property successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Property Categories
List categories

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/property_categories',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/property_categories

Returns a list of categories.

Parameters
Name	In	Type	Required	Description
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
starting_after	query	string	false	The ID of the category to start after.
ending_before	query	string	false	The ID of the category to end before.
context	query	string	false	Filter the results by User or Organization context
Enumerated Values
Parameter	Value
context	usr
context	org
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "categories": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "has_more": true
}
Responses
Status	Meaning	Description	Schema
200	OK	Categories successfully retrieved.	get_categories_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Category

Code samples

const inputBody = '{
  "name": "string",
  "context": "org"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/property_categories',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/property_categories

Create category.

Body parameter

{
  "name": "string",
  "context": "org"
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Category details.
» name	body	string	true	The name of the category.
» context	body	string	true	The context that the category applies to.
Enumerated Values
Parameter	Value
» context	org
» context	usr
Example responses

201 Response

{
  "message": "string",
  "code": "string",
  "category": {
    "id": "string"
  }
}
Responses
Status	Meaning	Description	Schema
201	Created	Category successfully created	create_category_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Category

Code samples

const inputBody = '{
  "name": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/property_categories/{category_id}',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/property_categories/{category_id}

Update category.

Body parameter

{
  "name": "string"
}
Parameters
Name	In	Type	Required	Description
category_id	path	string	true	The unique identifier for the category.
body	body	object	true	The fields of the category to update.
» name	body	string	false	The name of the category.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	category successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Roles
List Roles

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/roles

The returned list can be sorted by role name or role ID in ascending or descending order. The number of records to return at a time can also be controlled using the page_size query string parameter.

Parameters
Name	In	Type	Required	Description
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
sort	id_asc
sort	id_desc
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "roles": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Roles successfully retrieved.	get_roles_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Role

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "key": "string",
  "is_default_role": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/roles

Create role.

Body parameter

{
  "name": "string",
  "description": "string",
  "key": "string",
  "is_default_role": true
}
Parameters
Name	In	Type	Required	Description
body	body	object	false	Role details.
» name	body	string	false	The role's name.
» description	body	string	false	The role's description.
» key	body	string	false	The role identifier to use in code.
» is_default_role	body	boolean	false	Set role as default for new users.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	Role successfully created	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get Role Permissions

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles/{role_id}/permissions',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/roles/{role_id}/permissions

Get permissions for a role.

Parameters
Name	In	Type	Required	Description
role_id	path	string	true	The role's public id.
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
sort	id_asc
sort	id_desc
Example responses

200 Response

[
  {
    "id": "string",
    "key": "string",
    "name": "string",
    "description": "string"
  }
]
Responses
Status	Meaning	Description	Schema
200	OK	A list of permissions for a role	roles_permission_response
400	Bad Request	Error removing user	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Role Permissions

Code samples

const inputBody = '{
  "permissions": [
    {
      "id": "string",
      "operation": "string"
    }
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles/{role_id}/permissions',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/roles/{role_id}/permissions

Update role permissions.

Body parameter

{
  "permissions": [
    {
      "id": "string",
      "operation": "string"
    }
  ]
}
Parameters
Name	In	Type	Required	Description
role_id	path	string	true	The identifier for the role.
body	body	object	true	none
» permissions	body	[object]	false	Permissions to add or remove from the role.
»» id	body	string	false	The permission id.
»» operation	body	string	false	Optional operation, set to 'delete' to remove the permission from the role.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "permissions_added": [
    "string"
  ],
  "permissions_removed": [
    "string"
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Permissions successfully updated.	update_role_permissions_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Remove Role Permission

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles/{role_id}/permissions/{permission_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/roles/{role_id}/permissions/{permission_id}

Remove a permission from a role.

Parameters
Name	In	Type	Required	Description
role_id	path	string	true	The role's public id.
permission_id	path	string	true	The permission's public id.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Permission successfully removed from role	success_response
400	Bad Request	Error removing user	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Role

Code samples

const inputBody = '{
  "name": "string",
  "description": "string",
  "key": "string",
  "is_default_role": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles/{role_id}',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/roles/{role_id}

Update a role

Body parameter

{
  "name": "string",
  "description": "string",
  "key": "string",
  "is_default_role": true
}
Parameters
Name	In	Type	Required	Description
role_id	path	string	true	The identifier for the role.
body	body	object	false	Role details.
» name	body	string	true	The role's name.
» description	body	string	false	The role's description.
» key	body	string	true	The role identifier to use in code.
» is_default_role	body	boolean	false	Set role as default for new users.
Example responses

201 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
201	Created	Role successfully updated	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Role

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/roles/{role_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/roles/{role_id}

Delete role

Parameters
Name	In	Type	Required	Description
role_id	path	string	true	The identifier for the role.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Role successfully deleted.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Subscribers
List Subscribers

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/subscribers',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/subscribers

The returned list can be sorted by full name or email address in ascending or descending order. The number of records to return at a time can also be controlled using the page_size query string parameter.

Parameters
Name	In	Type	Required	Description
sort	query	string	false	Field and order to sort the result by.
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
next_token	query	string	false	A string to get the next page of results if there are more results.
Enumerated Values
Parameter	Value
sort	name_asc
sort	name_desc
sort	email_asc
sort	email_desc
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "subscribers": [
    {
      "id": "string",
      "email": "string",
      "full_name": "string",
      "first_name": "string",
      "last_name": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Subscriber successfully retrieved.	get_subscribers_response
403	Forbidden	Bad request.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create Subscriber

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/subscribers?first_name=string&last_name=string&email=string',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/subscribers

Create subscriber.

Parameters
Name	In	Type	Required	Description
first_name	query	string	true	Subscriber's first name.
last_name	query	string	true	Subscriber's last name.
email	query	string	true	The email address of the subscriber.
Example responses

201 Response

{
  "subscriber": {
    "subscriber_id": "string"
  }
}
Responses
Status	Meaning	Description	Schema
201	Created	Subscriber successfully created	create_subscriber_success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get Subscriber

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/subscribers/{subscriber_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/subscribers/{subscriber_id}

Retrieve a subscriber record.

Parameters
Name	In	Type	Required	Description
subscriber_id	path	string	true	The subscriber's id.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "subscribers": [
    {
      "id": "string",
      "preferred_email": "string",
      "first_name": "string",
      "last_name": "string"
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Subscriber successfully retrieved.	get_subscriber_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Users
List Users

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/users

The returned list can be sorted by full name or email address in ascending or descending order. The number of records to return at a time can also be controlled using the page_size query string parameter.

Parameters
Name	In	Type	Required	Description
page_size	query	integer	false	Number of results per page. Defaults to 10 if parameter not sent.
user_id	query	string	false	ID of the user to filter by.
next_token	query	string	false	A string to get the next page of results if there are more results.
email	query	string	false	Filter the results by email address. The query string should be comma separated and url encoded.
username	query	string	false	Filter the results by username. The query string should be comma separated and url encoded.
expand	query	string	false	Specify additional data to retrieve. Use "organizations" and/or "identities".
has_organization	query	boolean	false	Filter the results by if the user has at least one organization assigned.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "users": [
    {
      "id": "string",
      "provided_id": "string",
      "email": "string",
      "username": "string",
      "last_name": "string",
      "first_name": "string",
      "is_suspended": true,
      "picture": "string",
      "total_sign_ins": 0,
      "failed_sign_ins": 0,
      "last_signed_in": "string",
      "created_on": "string",
      "organizations": [
        "string"
      ],
      "identities": [
        {
          "type": "string",
          "identity": "string"
        }
      ]
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Users successfully retrieved.	users_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Refresh User Claims and Invalidate Cache

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/refresh_claims',
{
  method: 'POST',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/users/{user_id}/refresh_claims

Refreshes the user's claims and invalidates the current cache.

Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The id of the user whose claims needs to be updated.
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Claims successfully refreshed.	success_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Bad request.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get User

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/user?id=string',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/user

Retrieve a user record.

Parameters
Name	In	Type	Required	Description
id	query	string	true	The user's id.
expand	query	string	false	Specify additional data to retrieve. Use "organizations" and/or "identities".
Example responses

200 Response

{
  "id": "string",
  "provided_id": "string",
  "preferred_email": "string",
  "username": "string",
  "last_name": "string",
  "first_name": "string",
  "is_suspended": true,
  "picture": "string",
  "total_sign_ins": 0,
  "failed_sign_ins": 0,
  "last_signed_in": "string",
  "created_on": "string",
  "organizations": [
    "string"
  ],
  "identities": [
    {
      "type": "string",
      "identity": "string"
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully updated.	user
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create User

Code samples

const inputBody = '{
  "profile": {
    "given_name": "string",
    "family_name": "string"
  },
  "organization_code": "string",
  "identities": [
    {
      "type": "email",
      "details": {
        "email": "string",
        "phone": "string",
        "username": "string"
      }
    }
  ]
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/user',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/user

Creates a user record and optionally zero or more identities for the user. An example identity could be the email address of the user.

Body parameter

{
  "profile": {
    "given_name": "string",
    "family_name": "string"
  },
  "organization_code": "string",
  "identities": [
    {
      "type": "email",
      "details": {
        "email": "string",
        "phone": "string",
        "username": "string"
      }
    }
  ]
}
Parameters
Name	In	Type	Required	Description
body	body	object	false	The details of the user to create.
» profile	body	object	false	Basic information required to create a user.
»» given_name	body	string	false	User's first name.
»» family_name	body	string	false	User's last name.
» organization_code	body	string	false	The unique code associated with the organization you want the user to join.
» identities	body	[object]	false	Array of identities to assign to the created user
»» type	body	string	false	The type of identity to create, for e.g. email.
»» details	body	object	false	Additional details required to create the user.
»»» email	body	string	false	The email address of the user.
»»» phone	body	string	false	The phone number of the user.
»»» username	body	string	false	The username of the user.
Enumerated Values
Parameter	Value
»» type	email
»» type	phone
»» type	username
Example responses

200 Response

{
  "id": "string",
  "created": true,
  "identities": [
    {
      "type": "string",
      "result": {
        "created": true
      }
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully created.	create_user_response
400	Bad Request	Error creating user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update User

Code samples

const inputBody = '{
  "given_name": "string",
  "family_name": "string",
  "is_suspended": true,
  "is_password_reset_requested": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/user?id=string',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/user

Update a user record.

Body parameter

{
  "given_name": "string",
  "family_name": "string",
  "is_suspended": true,
  "is_password_reset_requested": true
}
Parameters
Name	In	Type	Required	Description
id	query	string	true	The user's id.
body	body	object	true	The user to update.
» given_name	body	string	false	User's first name.
» family_name	body	string	false	User's last name.
» is_suspended	body	boolean	false	Whether the user is currently suspended or not.
» is_password_reset_requested	body	boolean	false	Prompt the user to change their password on next sign in.
Example responses

200 Response

{
  "id": "string",
  "given_name": "string",
  "family_name": "string",
  "email": "string",
  "is_suspended": true,
  "is_password_reset_requested": true,
  "picture": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully updated.	update_user_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete User

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/user?id=string',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/user

Delete a user record.

Parameters
Name	In	Type	Required	Description
id	query	string	true	The user's id.
is_delete_profile	query	boolean	false	Delete all data and remove the user's profile from all of Kinde, including the subscriber list
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully deleted.	success_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update User Feature Flag Override

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/feature_flags/{feature_flag_key}?value=string',
{
  method: 'PATCH',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/users/{user_id}/feature_flags/{feature_flag_key}

Update user feature flag override.

Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The identifier for the user
feature_flag_key	path	string	true	The identifier for the feature flag
value	query	string	true	Override value
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Feature flag override successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Property value

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/properties/{property_key}?value=string',
{
  method: 'PUT',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/users/{user_id}/properties/{property_key}

Update property value.

Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The identifier for the user
property_key	path	string	true	The identifier for the property
value	query	string	true	The new property value
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Property successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get property values

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/properties',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/users/{user_id}/properties

Gets properties for an user by ID.

Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The user's ID.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "key": "string",
      "value": "string"
    }
  ],
  "next_token": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Properties successfully retrieved.	get_property_values_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update Property values

Code samples

const inputBody = '{
  "properties": {}
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/properties',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/users/{user_id}/properties

Update property values.

Body parameter

{
  "properties": {}
}
Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The identifier for the user
body	body	object	true	Properties to update.
» properties	body	object	true	Property keys and values
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Properties successfully updated.	success_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Set User password

Code samples

const inputBody = '{
  "hashed_password": "string",
  "hashing_method": "bcrypt",
  "salt": "string",
  "salt_position": "prefix",
  "is_temporary_password": true
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/password',
{
  method: 'PUT',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PUT /api/v1/users/{user_id}/password

Set user password.

Body parameter

{
  "hashed_password": "string",
  "hashing_method": "bcrypt",
  "salt": "string",
  "salt_position": "prefix",
  "is_temporary_password": true
}
Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The identifier for the user
body	body	object	true	Password details.
» hashed_password	body	string	true	The hashed password.
» hashing_method	body	string	false	The hashing method or algorithm used to encrypt the user’s password. Default is bcrypt.
» salt	body	string	false	Extra characters added to passwords to make them stronger. Not required for bcrypt.
» salt_position	body	string	false	Position of salt in password string. Not required for bcrypt.
» is_temporary_password	body	boolean	false	The user will be prompted to set a new password after entering this one.
Enumerated Values
Parameter	Value
» hashing_method	bcrypt
» hashing_method	crypt
» hashing_method	md5
» hashing_method	wordpress
» salt_position	prefix
» salt_position	suffix
Example responses

200 Response

{
  "message": "string",
  "code": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	User successfully created.	success_response
400	Bad Request	Error creating user.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Get identities

Code samples


const headers = {
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/identities',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/users/{user_id}/identities

Gets a list of identities for an user by ID.

Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The user's ID.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "type": "string",
      "is_confirmed": true,
      "created_on": "string",
      "last_login_on": "string",
      "total_logins": 0,
      "name": "string"
    }
  ],
  "has_more": true
}
Responses
Status	Meaning	Description	Schema
200	OK	Identities successfully retrieved.	get_identities_response
400	Bad Request	Bad request.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create identity

Code samples

const inputBody = '{
  "value": "string",
  "type": "email",
  "phone_country_id": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/users/{user_id}/identities',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/users/{user_id}/identities

Creates an identity for a user.

Body parameter

{
  "value": "string",
  "type": "email",
  "phone_country_id": "string"
}
Parameters
Name	In	Type	Required	Description
user_id	path	string	true	The user's ID.
body	body	object	false	The identity details.
» value	body	string	false	The email address, or username of the user.
» type	body	string	false	The identity type
» phone_country_id	body	string	false	The country code for the phone number, only required when identity type is 'phone'.
Enumerated Values
Parameter	Value
» type	email
» type	username
» type	phone
» type	enterprise
Example responses

200 Response

{
  "message": "string",
  "code": "string",
  "identity": {
    "id": "string"
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Identity successfully created.	create_identity_response
400	Bad Request	Error creating identity.	error_response
403	Forbidden	Invalid credentials.	None
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Webhooks
Get Event

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/events/{event_id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/events/{event_id}

Returns an event

Parameters
Name	In	Type	Required	Description
event_id	path	string	true	The event id.
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "event": {
    "type": "string",
    "source": "string",
    "event_id": "string",
    "timestamp": "string",
    "data": {}
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Event successfully retrieved.	get_event_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Event Types

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/event_types',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/event_types

Returns a list event type definitions

Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "event_types": [
    {
      "id": "string",
      "code": "string",
      "name": "string",
      "origin": "string",
      "schema": {}
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Event types successfully retrieved.	get_event_types_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Delete Webhook

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/webhooks/{webhook_id}',
{
  method: 'DELETE',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

DELETE /api/v1/webhooks/{webhook_id}

Delete webhook

Parameters
Name	In	Type	Required	Description
webhook_id	path	string	true	The webhook id.
Example responses

200 Response

{
  "code": "string",
  "message": "string"
}
Responses
Status	Meaning	Description	Schema
200	OK	Webhook successfully deleted.	delete_webhook_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
List Webhooks

Code samples


const headers = {
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/webhooks',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

GET /api/v1/webhooks

List webhooks

Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "webhooks": [
    {
      "id": "string",
      "name": "string",
      "endpoint": "string",
      "description": "string",
      "event_types": [
        "string"
      ],
      "created_on": "string"
    }
  ]
}
Responses
Status	Meaning	Description	Schema
200	OK	Webhook list successfully returned.	get_webhooks_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Create a Webhook

Code samples

const inputBody = '{
  "endpoint": "string",
  "event_types": [
    "string"
  ],
  "name": "string",
  "description": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/webhooks',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

POST /api/v1/webhooks

Create a webhook

Body parameter

{
  "endpoint": "string",
  "event_types": [
    "string"
  ],
  "name": "string",
  "description": "string"
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Webhook request specification.
» endpoint	body	string	true	The webhook endpoint url
» event_types	body	[string]	true	Array of event type keys
» name	body	string	true	The webhook name
» description	body	string¦null	false	The webhook description
Example responses

200 Response

{
  "code": "string",
  "message": "string",
  "webhook": {
    "id": "string",
    "endpoint": "string"
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Webhook successfully created.	create_webhook_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Update a Webhook

Code samples

const inputBody = '{
  "event_types": [
    "string"
  ],
  "name": "string",
  "description": "string"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json; charset=utf-8',
  'Authorization':'Bearer {access-token}'
};

fetch('https://{businessName}.kinde.com/api/v1/webhooks',
{
  method: 'PATCH',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

PATCH /api/v1/webhooks

Update a webhook

Body parameter

{
  "event_types": [
    "string"
  ],
  "name": "string",
  "description": "string"
}
Parameters
Name	In	Type	Required	Description
body	body	object	true	Update webhook request specification.
» event_types	body	[string]	false	Array of event type keys
» name	body	string	false	The webhook name
» description	body	string¦null	false	The webhook description
Example responses

200 Response

{
  "message": "string",
  "code": "string",
  "webhook": {
    "id": "string"
  }
}
Responses
Status	Meaning	Description	Schema
200	OK	Webhook successfully updated.	update_webhook_response
400	Bad Request	Invalid request.	error_response
403	Forbidden	Invalid credentials.	error_response
429	Too Many Requests	Request was throttled.	None
 To perform this operation, you must be authenticated by means of one of the following methods: kindeBearerAuth
Schemas
success_response

{
  "message": "string",
  "code": "string"
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
error

{
  "code": "string",
  "message": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Error code.
message	string	false	none	Error message.
error_response

{
  "errors": [
    {
      "code": "string",
      "message": "string"
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
errors	[error]	false	none	none
user

{
  "id": "string",
  "provided_id": "string",
  "preferred_email": "string",
  "username": "string",
  "last_name": "string",
  "first_name": "string",
  "is_suspended": true,
  "picture": "string",
  "total_sign_ins": 0,
  "failed_sign_ins": 0,
  "last_signed_in": "string",
  "created_on": "string",
  "organizations": [
    "string"
  ],
  "identities": [
    {
      "type": "string",
      "identity": "string"
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	Unique id of the user in Kinde.
provided_id	string	false	none	External id for user.
preferred_email	string	false	none	Default email address of the user in Kinde.
username	string	false	none	Primary username of the user in Kinde.
last_name	string	false	none	User's last name.
first_name	string	false	none	User's first name.
is_suspended	boolean	false	none	Whether the user is currently suspended or not.
picture	string	false	none	User's profile picture URL.
total_sign_ins	integer¦null	false	none	Total number of user sign ins.
failed_sign_ins	integer¦null	false	none	Number of consecutive failed user sign ins.
last_signed_in	string¦null	false	none	Last sign in date in ISO 8601 format.
created_on	string¦null	false	none	Date of user creation in ISO 8601 format.
organizations	[string]	false	none	Array of organizations a user belongs to.
identities	[object]	false	none	Array of identities belonging to the user.
» type	string	false	none	none
» identity	string	false	none	none
update_user_response

{
  "id": "string",
  "given_name": "string",
  "family_name": "string",
  "email": "string",
  "is_suspended": true,
  "is_password_reset_requested": true,
  "picture": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	Unique id of the user in Kinde.
given_name	string	false	none	User's first name.
family_name	string	false	none	User's last name.
email	string	false	none	User's preferred email.
is_suspended	boolean	false	none	Whether the user is currently suspended or not.
is_password_reset_requested	boolean	false	none	Whether a password reset has been requested.
picture	string	false	none	User's profile picture URL.
users

[
  {
    "id": "string",
    "provided_id": "string",
    "preferred_email": "string",
    "username": "string",
    "last_name": "string",
    "first_name": "string",
    "is_suspended": true,
    "picture": "string",
    "total_sign_ins": 0,
    "failed_sign_ins": 0,
    "last_signed_in": "string",
    "created_on": "string",
    "organizations": [
      "string"
    ],
    "identities": [
      {
        "type": "string",
        "identity": "string"
      }
    ]
  }
]

Array of users.

Properties
Name	Type	Required	Restrictions	Description
anonymous	[user]	false	none	Array of users.
users_response

{
  "code": "string",
  "message": "string",
  "users": [
    {
      "id": "string",
      "provided_id": "string",
      "email": "string",
      "username": "string",
      "last_name": "string",
      "first_name": "string",
      "is_suspended": true,
      "picture": "string",
      "total_sign_ins": 0,
      "failed_sign_ins": 0,
      "last_signed_in": "string",
      "created_on": "string",
      "organizations": [
        "string"
      ],
      "identities": [
        {
          "type": "string",
          "identity": "string"
        }
      ]
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
users	[object]	false	none	none
» id	string	false	none	Unique id of the user in Kinde.
» provided_id	string	false	none	External id for user.
» email	string	false	none	Default email address of the user in Kinde.
» username	string	false	none	Primary username of the user in Kinde.
» last_name	string	false	none	User's last name.
» first_name	string	false	none	User's first name.
» is_suspended	boolean	false	none	Whether the user is currently suspended or not.
» picture	string	false	none	User's profile picture URL.
» total_sign_ins	integer¦null	false	none	Total number of user sign ins.
» failed_sign_ins	integer¦null	false	none	Number of consecutive failed user sign ins.
» last_signed_in	string¦null	false	none	Last sign in date in ISO 8601 format.
» created_on	string¦null	false	none	Date of user creation in ISO 8601 format.
» organizations	[string]	false	none	Array of organizations a user belongs to.
» identities	[object]	false	none	Array of identities belonging to the user.
»» type	string	false	none	none
»» identity	string	false	none	none
next_token	string	false	none	Pagination token.
create_user_response

{
  "id": "string",
  "created": true,
  "identities": [
    {
      "type": "string",
      "result": {
        "created": true
      }
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	Unique id of the user in Kinde.
created	boolean	false	none	True if the user was successfully created.
identities	[user_identity]	false	none	none
create_organization_response

{
  "message": "string",
  "code": "string",
  "organization": {
    "code": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
organization	object	false	none	none
» code	string	false	none	The organization's code.
user_identity

{
  "type": "string",
  "result": {
    "created": true
  }
}

Properties
Name	Type	Required	Restrictions	Description
type	string	false	none	The type of identity object created.
result	object	false	none	The result of the user creation operation.
» created	boolean	false	none	True if the user identity was successfully created.
user_profile

{
  "id": "string",
  "preferred_email": "string",
  "username": "string",
  "provided_id": "string",
  "last_name": "string",
  "first_name": "string",
  "picture": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	Unique id of the user in Kinde.
preferred_email	string	false	none	Default email address of the user in Kinde.
username	string	false	none	Primary username of the user in Kinde.
provided_id	string¦null	false	none	Value of the user's id in a third-party system when the user is imported into Kinde.
last_name	string	false	none	User's last name.
first_name	string	false	none	User's first name.
picture	string	false	none	URL that point's to the user's picture or avatar
create_property_response

{
  "message": "string",
  "code": "string",
  "property": {
    "id": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
property	object	false	none	none
» id	string	false	none	The property's ID.
create_identity_response

{
  "message": "string",
  "code": "string",
  "identity": {
    "id": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
identity	object	false	none	none
» id	string	false	none	The identity's ID.
get_identities_response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "type": "string",
      "is_confirmed": true,
      "created_on": "string",
      "last_login_on": "string",
      "total_logins": 0,
      "name": "string"
    }
  ],
  "has_more": true
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
properties	[identity]	false	none	none
has_more	boolean	false	none	Whether more records exist.
get_properties_response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "is_private": true,
      "description": "string",
      "is_kinde_property": true
    }
  ],
  "has_more": true
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
properties	[property]	false	none	none
has_more	boolean	false	none	Whether more records exist.
get_property_values_response

{
  "code": "string",
  "message": "string",
  "properties": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "key": "string",
      "value": "string"
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
properties	[property_value]	false	none	none
next_token	string	false	none	Pagination token.
create_category_response

{
  "message": "string",
  "code": "string",
  "category": {
    "id": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
category	object	false	none	none
» id	string	false	none	The category's ID.
get_categories_response

{
  "code": "string",
  "message": "string",
  "categories": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "has_more": true
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
categories	[category]	false	none	none
has_more	boolean	false	none	Whether more records exist.
get_event_response

{
  "code": "string",
  "message": "string",
  "event": {
    "type": "string",
    "source": "string",
    "event_id": "string",
    "timestamp": "string",
    "data": {}
  }
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
event	object	false	none	none
» type	string	false	none	none
» source	string	false	none	none
» event_id	string	false	none	none
» timestamp	string	false	none	Timestamp in ISO 8601 format.
» data	object	false	none	Event specific data object.
get_event_types_response

{
  "code": "string",
  "message": "string",
  "event_types": [
    {
      "id": "string",
      "code": "string",
      "name": "string",
      "origin": "string",
      "schema": {}
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
event_types	[event_type]	false	none	none
get_webhooks_response

{
  "code": "string",
  "message": "string",
  "webhooks": [
    {
      "id": "string",
      "name": "string",
      "endpoint": "string",
      "description": "string",
      "event_types": [
        "string"
      ],
      "created_on": "string"
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
webhooks	[webhook]	false	none	none
webhook

{
  "id": "string",
  "name": "string",
  "endpoint": "string",
  "description": "string",
  "event_types": [
    "string"
  ],
  "created_on": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
name	string	false	none	none
endpoint	string	false	none	none
description	string	false	none	none
event_types	[string]	false	none	none
created_on	string	false	none	Created on date in ISO 8601 format.
create_webhook_response

{
  "code": "string",
  "message": "string",
  "webhook": {
    "id": "string",
    "endpoint": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
webhook	object	false	none	none
» id	string	false	none	none
» endpoint	string	false	none	none
update_webhook_response

{
  "message": "string",
  "code": "string",
  "webhook": {
    "id": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
webhook	object	false	none	none
» id	string	false	none	none
create_connection_response

{
  "message": "string",
  "code": "string",
  "connection": {
    "id": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
code	string	false	none	none
connection	object	false	none	none
» id	string	false	none	The connection's ID.
get_connections_response

{
  "code": "string",
  "message": "string",
  "connections": [
    {
      "id": "string",
      "name": "string",
      "display_name": "string",
      "strategy": "string"
    }
  ],
  "has_more": true
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
connections	[connection]	false	none	none
has_more	boolean	false	none	Whether more records exist.
delete_webhook_response

{
  "code": "string",
  "message": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
event_type

{
  "id": "string",
  "code": "string",
  "name": "string",
  "origin": "string",
  "schema": {}
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
code	string	false	none	none
name	string	false	none	none
origin	string	false	none	none
schema	object	false	none	none
token_introspect

{
  "active": true,
  "aud": [
    "string"
  ],
  "client_id": "string",
  "exp": "string",
  "iat": "string"
}

Properties
Name	Type	Required	Restrictions	Description
active	boolean	false	none	Indicates the status of the token.
aud	[string]	false	none	Array of intended token recipients.
client_id	string	false	none	Identifier for the requesting client.
exp	string	false	none	Token expiration timestamp.
iat	string	false	none	Token issuance timestamp.
token_error_response

{
  "error": "string",
  "error_description": "string"
}

Properties
Name	Type	Required	Restrictions	Description
error	string	false	none	Error.
error_description	string	false	none	The error description.
user_profile_v2

{
  "id": "string",
  "sub": "string",
  "provided_id": "string",
  "name": "string",
  "given_name": "string",
  "family_name": "string",
  "updated_at": 0,
  "email": "string",
  "picture": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	Unique id of the user in Kinde (deprecated).
sub	string	false	none	Unique id of the user in Kinde.
provided_id	string¦null	false	none	Value of the user's id in a third-party system when the user is imported into Kinde.
name	string	false	none	User's first and last name separated by a space.
given_name	string	false	none	User's first name.
family_name	string	false	none	User's last name.
updated_at	integer	false	none	Date the user was last updated at (In Unix time).
email	string	false	none	User's email address if available.
picture	string	false	none	URL that point's to the user's picture or avatar
organization

{
  "code": "string",
  "name": "string",
  "is_default": true,
  "external_id": "string",
  "logo": "string",
  "link_color": "string",
  "button_color": "string",
  "background_color": "string",
  "button_text_color": "string",
  "is_allow_registrations": true
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	none
name	string	false	none	none
is_default	boolean	false	none	none
external_id	string	false	none	none
logo	string	false	none	none
link_color	string	false	none	none
button_color	string	false	none	none
background_color	string	false	none	none
button_text_color	string	false	none	none
is_allow_registrations	boolean	false	none	none
organization_user

{
  "id": "string",
  "email": "string",
  "full_name": "string",
  "last_name": "string",
  "first_name": "string",
  "picture": "string",
  "roles": [
    "string"
  ]
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
email	string	false	none	none
full_name	string	false	none	none
last_name	string	false	none	none
first_name	string	false	none	none
picture	string	false	none	none
roles	[string]	false	none	none
category

{
  "id": "string",
  "name": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
name	string	false	none	none
connection

{
  "id": "string",
  "name": "string",
  "display_name": "string",
  "strategy": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
name	string	false	none	none
display_name	string	false	none	none
strategy	string	false	none	none
identity

{
  "id": "string",
  "type": "string",
  "is_confirmed": true,
  "created_on": "string",
  "last_login_on": "string",
  "total_logins": 0,
  "name": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
type	string	false	none	none
is_confirmed	boolean	false	none	none
created_on	string	false	none	Date of user creation in ISO 8601 format.
last_login_on	string	false	none	Date of user creation in ISO 8601 format.
total_logins	integer	false	none	none
name	string	false	none	none
property

{
  "id": "string",
  "key": "string",
  "name": "string",
  "is_private": true,
  "description": "string",
  "is_kinde_property": true
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
key	string	false	none	none
name	string	false	none	none
is_private	boolean	false	none	none
description	string	false	none	none
is_kinde_property	boolean	false	none	none
property_value

{
  "id": "string",
  "name": "string",
  "description": "string",
  "key": "string",
  "value": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
name	string	false	none	none
description	string	false	none	none
key	string	false	none	none
value	string	false	none	none
role

{
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
key	string	false	none	none
name	string	false	none	none
description	string	false	none	none
subscribers_subscriber

{
  "id": "string",
  "email": "string",
  "full_name": "string",
  "first_name": "string",
  "last_name": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
email	string	false	none	none
full_name	string	false	none	none
first_name	string	false	none	none
last_name	string	false	none	none
subscriber

{
  "id": "string",
  "preferred_email": "string",
  "first_name": "string",
  "last_name": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
preferred_email	string	false	none	none
first_name	string	false	none	none
last_name	string	false	none	none
organization_user_role

{
  "id": "string",
  "key": "string",
  "name": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
key	string	false	none	none
name	string	false	none	none
organization_user_role_permissions

{
  "id": "string",
  "role": "string",
  "permissions": {
    "key": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
role	string	false	none	none
permissions	object	false	none	none
» key	string	false	none	none
organization_user_permission

{
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string",
  "roles": [
    {
      "id": "string",
      "key": "string"
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
key	string	false	none	none
name	string	false	none	none
description	string	false	none	none
roles	[object]	false	none	none
» id	string	false	none	none
» key	string	false	none	none
organization_users

[
  {
    "id": "string",
    "email": "string",
    "full_name": "string",
    "last_name": "string",
    "first_name": "string",
    "picture": "string",
    "roles": [
      "string"
    ]
  }
]

Properties
Name	Type	Required	Restrictions	Description
anonymous	[organization_user]	false	none	none
get_subscriber_response

{
  "code": "string",
  "message": "string",
  "subscribers": [
    {
      "id": "string",
      "preferred_email": "string",
      "first_name": "string",
      "last_name": "string"
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
subscribers	[subscriber]	false	none	none
get_subscribers_response

{
  "code": "string",
  "message": "string",
  "subscribers": [
    {
      "id": "string",
      "email": "string",
      "full_name": "string",
      "first_name": "string",
      "last_name": "string"
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
subscribers	[subscribers_subscriber]	false	none	none
next_token	string	false	none	Pagination token.
get_roles_response

{
  "code": "string",
  "message": "string",
  "roles": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
roles	[roles]	false	none	none
next_token	string	false	none	Pagination token.
get_organizations_response

{
  "code": "string",
  "message": "string",
  "organizations": [
    {
      "code": "string",
      "name": "string",
      "is_default": true,
      "external_id": "string",
      "logo": "string",
      "link_color": "string",
      "button_color": "string",
      "background_color": "string",
      "button_text_color": "string",
      "is_allow_registrations": true
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
organizations	[organization]	false	none	none
next_token	string	false	none	Pagination token.
get_organization_users_response

{
  "code": "string",
  "message": "string",
  "organization_users": [
    {
      "id": "string",
      "email": "string",
      "full_name": "string",
      "last_name": "string",
      "first_name": "string",
      "picture": "string",
      "roles": [
        "string"
      ]
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
organization_users	[organization_user]	false	none	none
next_token	string	false	none	Pagination token.
get_organizations_user_roles_response

{
  "code": "string",
  "message": "string",
  "roles": [
    {
      "id": "string",
      "key": "string",
      "name": "string"
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
roles	[organization_user_role]	false	none	none
next_token	string	false	none	Pagination token.
get_organizations_user_permissions_response

{
  "code": "string",
  "message": "string",
  "permissions": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "description": "string",
      "roles": [
        {
          "id": "string",
          "key": "string"
        }
      ]
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
permissions	[organization_user_permission]	false	none	none
get_organization_feature_flags_response

{
  "code": "string",
  "message": "string",
  "feature_flags": {
    "property1": {
      "type": "str",
      "value": "string"
    },
    "property2": {
      "type": "str",
      "value": "string"
    }
  }
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
feature_flags	object	false	none	The environment's feature flag settings.
» additionalProperties	object	false	none	none
»» type	string	false	none	none
»» value	string	false	none	none
Enumerated Values
Property	Value
type	str
type	int
type	bool
get_environment_feature_flags_response

{
  "code": "string",
  "message": "string",
  "feature_flags": {
    "property1": {
      "type": "str",
      "value": "string"
    },
    "property2": {
      "type": "str",
      "value": "string"
    }
  },
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
feature_flags	object	false	none	The environment's feature flag settings.
» additionalProperties	object	false	none	none
»» type	string	false	none	none
»» value	string	false	none	none
next_token	string	false	none	Pagination token.
Enumerated Values
Property	Value
type	str
type	int
type	bool
add_organization_users_response

{
  "code": "string",
  "message": "string",
  "users_added": [
    "string"
  ]
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
users_added	[string]	false	none	none
update_role_permissions_response

{
  "code": "string",
  "message": "string",
  "permissions_added": [
    "string"
  ],
  "permissions_removed": [
    "string"
  ]
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	none
message	string	false	none	none
permissions_added	[string]	false	none	none
permissions_removed	[string]	false	none	none
update_organization_users_response

{
  "message": "string",
  "users_added": [
    "string"
  ],
  "users_updated": [
    "string"
  ],
  "users_removed": [
    "string"
  ]
}

Properties
Name	Type	Required	Restrictions	Description
message	string	false	none	none
users_added	[string]	false	none	none
users_updated	[string]	false	none	none
users_removed	[string]	false	none	none
connected_apps_auth_url

{
  "url": "string",
  "session_id": "string"
}

Properties
Name	Type	Required	Restrictions	Description
url	string	false	none	A URL that is used to authenticate an end-user against a connected app.
session_id	string	false	none	A unique identifier for the login session.
create_subscriber_success_response

{
  "subscriber": {
    "subscriber_id": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
subscriber	object	false	none	none
» subscriber_id	string	false	none	A unique identifier for the subscriber.
connected_apps_access_token

{
  "access_token": "string",
  "access_token_expiry": "string"
}

Properties
Name	Type	Required	Restrictions	Description
access_token	string	false	none	The access token to access a third-party provider.
access_token_expiry	string	false	none	The date and time that the access token expires.
api_result

{
  "result": "string"
}

Properties
Name	Type	Required	Restrictions	Description
result	string	false	none	The result of the api operation.
create_application_response

{
  "code": "string",
  "message": "string",
  "application": {
    "id": "string",
    "client_id": "string",
    "client_secret": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
application	object	false	none	none
» id	string	false	none	The application's identifier.
» client_id	string	false	none	The application's client id.
» client_secret	string	false	none	The application's client secret.
get_application_response

{
  "code": "string",
  "message": "string",
  "application": {
    "id": "string",
    "name": "string",
    "type": "string",
    "client_id": "string",
    "client_secret": "string",
    "login_uri": "string",
    "homepage_uri": "string"
  }
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
application	object	false	none	none
» id	string	false	none	The application's identifier.
» name	string	false	none	The application's name.
» type	string	false	none	The application's type.
» client_id	string	false	none	The application's client id.
» client_secret	string	false	none	The application's client secret.
» login_uri	string	false	none	The default login route for resolving session issues.
» homepage_uri	string	false	none	The homepage link to your application.
applications

{
  "id": "string",
  "name": "string",
  "type": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
name	string	false	none	none
type	string	false	none	none
get_applications_response

{
  "code": "string",
  "message": "string",
  "applications": [
    {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
applications	[applications]	false	none	none
next_token	string	false	none	Pagination token.
redirect_callback_urls

{
  "redirect_urls": [
    "string"
  ]
}

Properties
Name	Type	Required	Restrictions	Description
redirect_urls	[string]	false	none	An application's redirect URLs.
get_redirect_callback_urls_response

{
  "redirect_urls": [
    {
      "redirect_urls": [
        "string"
      ]
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
redirect_urls	[redirect_callback_urls]	false	none	An application's redirect callback URLs.
logout_redirect_urls

{
  "redirect_urls": [
    "string"
  ]
}

Properties
Name	Type	Required	Restrictions	Description
redirect_urls	[string]	false	none	An application's logout URLs.
get_permissions_response

{
  "code": "string",
  "message": "string",
  "permissions": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "next_token": "string"
}

Properties
Name	Type	Required	Restrictions	Description
code	string	false	none	Response code.
message	string	false	none	Response message.
permissions	[permissions]	false	none	none
next_token	string	false	none	Pagination token.
permissions

{
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	The permission's id.
key	string	false	none	The permission identifier to use in code.
name	string	false	none	The permission's name.
description	string	false	none	The permission's description.
roles

{
  "id": "string",
  "key": "string",
  "name": "string",
  "description": "string"
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	The role's id.
key	string	false	none	The role identifier to use in code.
name	string	false	none	The role's name.
description	string	false	none	The role's description.
roles_permission_response

[
  {
    "id": "string",
    "key": "string",
    "name": "string",
    "description": "string"
  }
]

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	none
key	string	false	none	none
name	string	false	none	none
description	string	false	none	none
apis

{
  "id": "string",
  "name": "string",
  "audience": "string",
  "is_management_api": true
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	Unique id of the API.
name	string	false	none	The API's name.
audience	string	false	none	The logical identifier for the API.
is_management_api	boolean	false	none	Whether it is the management API or not.
api

{
  "id": "string",
  "code": "string",
  "name": "string",
  "message": "string",
  "audience": "string",
  "applications": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "is_active": true
    }
  ]
}

Properties
Name	Type	Required	Restrictions	Description
id	string	false	none	The API's unique identifier.
code	string	false	none	Response code.
name	string	false	none	The API's name.
message	string	false	none	Response message.
audience	string	false	none	The API's audience.
applications	[object]	false	none	none
» id	string	false	none	none
» name	string	false	none	none
» type	string	false	none	none
» is_active	boolean	false	none	none
JavaScript
Go
HTTP