import SelectAuthenticator from '../selectors/SelectAuthenticator';
import clickElement from './clickElement';
import selectOption from './selectOption';

export default async () => {
  await selectOption('value', 'email', SelectAuthenticator.options);
  await clickElement('click', 'selector', SelectAuthenticator.submit);
};