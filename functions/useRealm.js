import { useState, useEffect, useRef } from "react";
import Realm, { BSON } from "realm";

const PlaceSchema = {
  name: "Place",
  properties: {
    _id: "objectId",
    name: "string",
    location: "float[]",
    formattedAddress: "string",
    type: "string",
    phoneNumber: "string?",
    emailAddress: "string?",
    website: "string?",
  },
  primaryKey: "_id",
};

const realmApp = new Realm.App({
  id: "nativemap-doaxl",
  baseUrl: "https://realm.mongodb.com",
});

const useRealm = () => {
  const realmReference = useRef(null);
  const [places, setPlaces] = useState([]);
  const [stores, setStores] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [bakery, setBakery] = useState([]);
  const [gym, setGym] = useState([]);
  const [other, setOther] = useState([]);

  useEffect(() => {
    const creds = Realm.Credentials.emailPassword("system", "password");
    (async () => {
      await realmApp.logIn(creds);
    })();
    const config = {
      schema: [PlaceSchema],
      sync: {
        user: realmApp?.currentUser,
        partitionValue: realmApp?.currentUser?.id,
      },
    };

    Realm.open(config)
      .then((realmInstance) => {
        realmReference.current = realmInstance;
        const realm = realmReference.current;
        if (realm) {
          setPlaces(realm.objects("Place"));
          setStores(realm.objects("Place").filtered("type == 'Store'"));
          setCafes(realm.objects("Place").filtered("type == 'Cafe'"));
          setRestaurants(
            realm.objects("Place").filtered("type == 'Restaurant'")
          );
          setBakery(realm.objects("Place").filtered("type == 'Bakery'"));
          setGym(realm.objects("Place").filtered("type == 'Gym'"));
          setOther(realm.objects("Place").filtered("type == 'Other'"));
        }
      })
      .catch((err) => {
        console.log(`an error occurred opening the realm ${err}`);
      });

    return () => {
      const realm = realmReference.current;
      if (realm) {
        realm.close();
        realmReference.current = null;
        setPlaces([]);
      }
    };
  }, [realmReference]);

  const createplace = (
    placeName,
    placeLocation,
    placeFormattedAddress,
    placeType,
    placePhoneNumber,
    placeEmailAddress,
    placeWebsite
  ) => {
    const realm = realmReference.current;
    if (realm) {
      realm.write(() => {
        realm.create("Place", {
          _id: new BSON.ObjectID(),
          partition: realmApp.currentUser?.id,
          name: placeName,
          location: placeLocation,
          formattedAddress: placeFormattedAddress,
          type: placeType,
          phoneNumber: placePhoneNumber,
          emailAddress: placeEmailAddress,
          website: placeWebsite,
        });
      });
    }
  };

  const fetchPlaces = () => places;
  const fetchStores = () => stores;
  const fetchCafes = () => cafes;
  const fetchRestaurants = () => restaurants;
  const fetchBakery = () => bakery;
  const fetchGym = () => gym;
  const fetchOther = () => other;
  return {
    fetchOther,
    fetchGym,
    fetchBakery,
    fetchRestaurants,
    fetchCafes,
    fetchStores,
    fetchPlaces,
    createplace,
  };
};

export default useRealm;
