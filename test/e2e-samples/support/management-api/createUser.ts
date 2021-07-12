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


import { Client, Group, User } from '@okta/okta-sdk-nodejs';
import { getConfig } from '../../util';
import deleteUser from './deleteUser';
import { UserCredentials } from './createCredentials';

export default async (credentials: UserCredentials, assignToGroups = ['Basic Auth Web']): Promise<User> => {
  const config = getConfig();
  const oktaClient = new Client({
    orgUrl: config.orgUrl,
    token: config.oktaAPIKey,
  });

  let user;
  try {
    user = await oktaClient.createUser({
      profile: {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.emailAddress,
        login: credentials.emailAddress
      },
      credentials: {
        password : { value: credentials.password }
      }
    }, {
      activate: true
    });

    await oktaClient.assignUserToApplication(config.clientId as string, {
      id: user.id
    });
    
    for (const groupName of assignToGroups) {
      // TODO: create test group and attach password recovery policy during test run when API supports it
      const {value: testGroup} = await oktaClient.listGroups({
        q: groupName
      }).next();

      if (!testGroup) {
        throw new Error(`Group "${groupName}" is not found`);
      }

      await oktaClient.addUserToGroup((testGroup as Group).id, user.id);
    }

    return user;
  } catch (err) {
    if (user) {
      await deleteUser(user);
    }
    throw err;
  }
};