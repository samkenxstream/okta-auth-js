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



jest.mock('../../../lib/oidc', () => {
  const origModule = jest.requireActual('../../../lib/oidc');
  return Object.assign({}, origModule, {
    isInteractionRequiredError: jest.fn(),
    isInteractionRequired: jest.fn()
  });
});

import { 
  OktaAuth
} from '@okta/okta-auth-js';
import * as constants from '../../../lib/constants';

describe('commonJS interface', () => {

  describe('static type', () => {
    it('exposes features on type and prototype', () => {
      expect(OktaAuth.features).toBeTruthy();
      expect(OktaAuth.prototype.features).toBeTruthy();
    });
    it('exposes constants', () => {
      expect(OktaAuth.constants).toBeTruthy();
      const keys = Object.keys(constants);
      expect(keys.length).toBeGreaterThan(0);
      keys.forEach(key => {
        expect(OktaAuth.constants[key]).toBe(constants[key]);
      });
    });
  });
});
