import Realm from 'realm';

const appConfiguration = {
  id: 'nativemap-doaxl',
  baseUrl: 'https://realm.mongodb.com',
};

export const realmApp = new Realm.App(appConfiguration);
