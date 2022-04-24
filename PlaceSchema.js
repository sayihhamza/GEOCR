const PlaceSchema = {
  name: 'Place',
  properties: {
    _id: 'objectId',
    name: 'string',
    location: 'float[]',
    formattedAddress: 'string',
    type: 'string',
    phoneNumber: 'string?',
    emailAddress: 'string?',
    website: 'string?',
  },
  primaryKey: '_id',
};

export {PlaceSchema};
