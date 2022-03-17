/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */


import { Given } from '@cucumber/cucumber';
import setEnvironment from '../support/action/setEnvironment';
import navigateTo from '../support/action/navigateTo';
import navigateToLoginAndAuthenticate from '../support/action/context-enabled/live-user/navigateToLoginAndAuthenticate';
import createContextUserAndCredentials from '../support/action/context-enabled/live-user/createContextUserAndCredentials';
import createContextCredentials from '../support/action/context-enabled/live-user/createContextCredentials';
import activateContextUserSms from '../support/action/context-enabled/live-user/activateContextUserSms';
import ActionContext from '../support/context';
import attachSSRPolicy from '../support/action/context-enabled/org-config/attachProfileEnrollmentPolicyWithCustomProfileAttribute';
import createContextUser from '../support/action/context-enabled/live-user/createContextUser';
import activateContextUserActivationToken from '../support/action/context-enabled/live-user/activateContextUserActivationToken';
import Home from '../support/selectors/Home';
import startApp from '../support/action/startApp';
import noop from '../support/action/noop';

// NOTE: noop function is used for predefined settings

Given(
  'a Profile Enrollment policy defined assigning new users to the Everyone Group', 
  noop
);

Given(
  /^by collecting "First Name", "Last Name", "Email"(?: is allowed and assigned to a SPA, WEB APP or MOBILE application)?$/, 
  noop
);

Given(
  'a property named {string} is allowed and assigned to a SPA, WEB APP or MOBILE application',
  attachSSRPolicy
);

Given(
  /^an APP$/,
  async function() {
    return await setEnvironment('default');
  }
);

Given(
  /^an APP Sign On Policy (.*)$/,
  setEnvironment
);

Given(
  /^an org with (.*)$/,
  setEnvironment
);

Given(
  /^a SPA, WEB APP or MOBILE Policy (.*)$/,
  setEnvironment
);

// 1. Org has preconfigured MFA policy "Google Authenticator Required Policy"
//    for group "Google Authenticator Enrollment Required"
// 2. App has preconfigured sign-on policy "MFA Required" for group "MFA Required"
// 3. App has preconfigured profile enrollment policy "Google Authenticator Policy"
//    for group "Google Authenticator Enrollment Required"
// 4. App should be changed with environment "Password and Google Authenticator Required"
//    (see next line)
Given(
  /^configured Authenticators are Password \(required\), and Google Authenticator \(required\)$/,
  noop
);

Given(
  /^the Application Sign on Policy is set to "(.*)"$/,
  setEnvironment
);

Given(
  /([^/s]+) has an account in the org/,
  async function(this: ActionContext, firstName: string) {
    await createContextUser.call(this, { firstName });
  }
);

Given(
  /[^/s]+ does not have account in the org/,
  noop
);

Given(
  /^a User named "([^/w]+)" exists, and this user has already setup email and password factors$/,
  async function(this: ActionContext, firstName: string) {
    await createContextUserAndCredentials.call(this, firstName);
  }
);

Given(
  'a user named {string}',
  createContextCredentials
);

Given(
  /^([^/s]+) is a user with a verified email and a set password$/,
  async function(this: ActionContext, firstName: string) {
    await createContextUserAndCredentials.call(this, firstName);
  }
);

Given(
  /^([^/s]+) navigates to (?:the )?(.*)$/,
  async function(this: ActionContext, firstName, pageName) {
    await navigateTo(pageName);
  }
);

Given(
  'Mary has an authenticated session',
  navigateToLoginAndAuthenticate
);

Given(
  /^a User named "([^/s]+)" created in the admin interface with a Password only$/,
  async function(this: ActionContext, firstName: string) {
    await createContextUserAndCredentials.call(this, firstName, ['MFA Required']);
  }
);

Given(
  /^a User named "([^/s]+)" is created in staged state$/,
  async function(this: ActionContext, firstName: string) {
    await createContextUserAndCredentials.call(this, firstName, ['MFA Required'], false);
  }
);

Given(
  /^Mary opens the Self Service Registration View with activation token/,
  activateContextUserActivationToken
);

Given(
  /^an Authenticator Enrollment Policy that has PHONE as optional and EMAIL as required for the Everyone Group$/,
  noop
);

Given(
  /^a User named "([^/s]+)" created that HAS NOT yet enrolled in the SMS factor$/,
  async function(this: ActionContext, firstName: string) {
    await createContextUserAndCredentials.call(this, firstName, ['Phone Enrollment Required', 'MFA Required']);
  }
);

Given(
  /^Mary has enrolled in the SMS factor$/,
  activateContextUserSms
);

Given(
  /^she is not enrolled in any authenticators$/,
  noop
);

Given(
  'Mary is on the Root View in an UNAUTHENTICATED state',
  async () => await startApp(Home.path)
);
