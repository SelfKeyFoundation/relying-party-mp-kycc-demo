# Login With Selfkey Demo for KYCC users

## Contents

- [Usage](#usage)
- [Integration With KYC-Chain](#kycc-integration)
- [License](#license)

<a name="usage"></a>

## Usage

### Install

```sh
git clone https://github.com/SelfKeyFoundation/relying-party-mp-kycc-demo.git
cd relying-party-mp-kycc-demo
yarn install
```

### KYC-Chain config

export 2  env variables if you run directly
```
KYCC_API_URL=http://instance-id.kyc-chain.com/
KYCC_API_KEY=my-kycc-api-keu
```

or create an `.env` file containing them if you run with `docker-compose`

### Run

```sh
yarn start
```

### Or with docker

```sh
docker-compose up
```
<a name="kycc-integration"></a>

## Integration with KYC-Chain

### Prerequisites

- the webhook endpoint that is exposed on your server should be configured on KYC-Chain instance
- you should get an API key for the instance

### Handle webhook events

The webhook endpoint will receive post request from KYC-Chain instance on any status change of an application.

The request payload will contain application id and status

```js
{
    applicationId: '5e8c782aa88e7b00139f589d',
    status: 2,
    updatedAt: '2020-04-08T12:26:26.479Z'
}
```

Possible application status codes are:

```js
{
    MISSING: 0,
    IN_PROGRESS: 1,
    APPROVED: 2,
    REJECTED: 3,
    UPLOADED: 4,
    INVITED: 5,
    USER_PROCESSING: 6,
    USER_DECLINED: 7,
    CANCELED: 8,
    ADDITIONAL_REQUESTED: 9,
    CORPORATE_DETAILS: 10,
    USER_PROCESSING_REQUIREMENT: 11,
    PARTIALLY_APPROVED: 12,
    SEND_TOKENS: 13,
    MANAGER_ASSIGNED: 14,
    DATA_CHECK: 15,
    REOPENED: 16
};
```

Example: [routes/webhook.js](https://github.com/SelfKeyFoundation/relying-party-mp-kycc-demo/blob/master/src/routes/webhook.js#L8)

### Control the application via KYC-Chain API

There are 2 official options to work with KYC-Chain API

- use our Node.js client lib
- directly perform http requests

### Install node.js client

[Github](https://github.com/SelfKeyFoundation/selfkey-lib)

```bash
npm install --save @selfkey/node-lib
```

### Initialize node.js client

```js
const sk = require('@selfkey/node-lib');
const client = sk.kycc.createKYCCIntegrationsClient({
    apiKey: "<KYCC_API_KEY>",
    instanceUrl: "<KYCC_API_URL>"
});
```

Example: [kycc-client.js](https://github.com/SelfKeyFoundation/relying-party-mp-kycc-demo/blob/master/src/kycc-client.js)

### Get detailed application object

#### Node.js

```js
const application = await kyccClient.applications.get(applicationId);
```

Example: [routes/webhook.js](https://github.com/SelfKeyFoundation/relying-party-mp-kycc-demo/blob/master/src/routes/webhook.js#L12)

#### HTTP

```bash
GET <KYCC_API_KEY>/integrations/v2/applications/<APPLICATION_ID>

HEADERS:
apiKey: <KYCC_API_URL>
```

#### Example Response:

```js
{
    "attributes": {
        "5e81d956f52e300013c7e5c1": {
            "description": "Please enter your e-mail address.",
            "isAdditional": false,
            "label": "Email",
            "optional": false,
            "schema": "http://platform.selfkey.org/schema/attribute/email.json",
            "valid": true,
            "value": "test3@test.com"
        },
        "5e81d956f52e300013c7e5c2": {
            "description": "First name",
            "isAdditional": false,
            "label": "First name",
            "optional": false,
            "schema": "http://platform.selfkey.org/schema/attribute/first-name.json",
            "valid": false,
            "value": "Test"
        },
        "5e81d956f52e300013c7e5c3": {
            "description": "Middle name",
            "isAdditional": false,
            "label": "Middle name",
            "optional": true,
            "schema": "http://platform.selfkey.org/schema/attribute/middle-name.json",
            "valid": false,
            "value": "test"
        },
        "5e81d956f52e300013c7e5c4": {
            "description": "Last name",
            "isAdditional": false,
            "label": "Last name",
            "optional": false,
            "schema": "http://platform.selfkey.org/schema/attribute/last-name.json",
            "valid": true,
            "value": "test"
        },
        "5e81d9d6f52e300013c7e5c6": {
            "description": "Bank Statement",
            "isAdditional": false,
            "label": "Bank Statement",
            "optional": false,
            "schema": "http://platform.selfkey.org/schema/attribute/bank-statement.json",
            "valid": true,
            "value": {
                "issued": "2020-04-01",
                "images": [
                    {
                        "content": "5e8c7864a88e7b00139f58ac",
                        "mimeType": "image/png",
                        "size": 147726
                    }
                ]
            }
        }
    },
    "dataChecks": [],
    "forms": [],
    "notes": [
        {
            "_id": "5e8c85c2a88e7b00139f58d2",
            "external": false,
            "content": "I am approving this application",
            "owner": "5d25a03ff784627fe5b96918",
            "createdAt": "2020-04-07T13:53:06.748Z"
        },
        {
            "_id": "5e8c8632a88e7b00139f58d7",
            "external": false,
            "content": "application reopened",
            "owner": "5d25a03ff784627fe5b96918",
            "createdAt": "2020-04-07T13:54:58.266Z"
        },
        {
            "_id": "5e8c8851a88e7b00139f58dd",
            "external": false,
            "content": "I am approving this application",
            "owner": "5d25a03ff784627fe5b96918",
            "createdAt": "2020-04-07T14:04:01.784Z"
        },
        {
            "_id": "5e8c8991a88e7b00139f58e1",
            "external": false,
            "content": "application reopened",
            "owner": "5d25a03ff784627fe5b96918",
            "createdAt": "2020-04-07T14:09:21.594Z"
        },
        {
            "_id": "5e8c89bfa88e7b00139f58e7",
            "external": false,
            "content": "I am approving this application",
            "owner": "5d25a03ff784627fe5b96918",
            "createdAt": "2020-04-07T14:10:07.975Z"
        },
        {
            "_id": "5e8c9285a88e7b00139f58eb",
            "external": false,
            "content": "application reopened",
            "owner": "5d25a03ff784627fe5b96918",
            "createdAt": "2020-04-07T14:47:33.428Z"
        }
    ],
    "owners": [
        {
            "_id": "5e8c782aa88e7b00139f589c",
            "email": "test3@test.com"
        }
    ],
    "payments": [],
    "questions": {},
    "requirementsLog": {
        "5e81d956f52e300013c7e5c2": [
            {
                "action": "invalidation",
                "createdAt": "2020-04-07T12:57:39.575Z",
                "manager": "5d25a03ff784627fe5b96918",
                "comments": []
            }
        ],
        "5e81d956f52e300013c7e5c3": [
            {
                "action": "invalidation",
                "createdAt": "2020-04-07T12:57:39.575Z",
                "manager": "5d25a03ff784627fe5b96918",
                "comments": []
            }
        ]
    },
    "type": "individual",
    "memberTemplates": [],
    "template": {
        "_id": "5e81d956f52e300013c7e5be",
        "requirements": {
            "questions": [
                {
                    "datepicker": false,
                    "multiple": false,
                    "optional": false,
                    "options": [],
                    "type": "kyc",
                    "weight": 0,
                    "_id": "5e81d956f52e300013c7e5c1",
                    "attributeType": "http://platform.selfkey.org/schema/attribute/email.json",
                    "description": "Please enter your e-mail address.",
                    "question": "Email",
                    "title": "Email"
                },
                {
                    "datepicker": false,
                    "multiple": false,
                    "optional": false,
                    "options": [],
                    "type": "kyc",
                    "weight": 0,
                    "_id": "5e81d956f52e300013c7e5c2",
                    "attributeType": "http://platform.selfkey.org/schema/attribute/first-name.json",
                    "description": "First name",
                    "question": "First name",
                    "title": "First name"
                },
                {
                    "datepicker": false,
                    "multiple": false,
                    "optional": true,
                    "options": [],
                    "type": "kyc",
                    "weight": 0,
                    "_id": "5e81d956f52e300013c7e5c3",
                    "attributeType": "http://platform.selfkey.org/schema/attribute/middle-name.json",
                    "description": "Middle name",
                    "question": "Middle name",
                    "title": "Middle name"
                },
                {
                    "datepicker": false,
                    "multiple": false,
                    "optional": false,
                    "options": [],
                    "type": "kyc",
                    "weight": 0,
                    "_id": "5e81d956f52e300013c7e5c4",
                    "attributeType": "http://platform.selfkey.org/schema/attribute/last-name.json",
                    "description": "Last name",
                    "question": "Last name",
                    "title": "Last name"
                }
            ],
            "uploads": [
                {
                    "certifiedTrueCopy": {
                        "offSystem": false,
                        "onSystem": false
                    },
                    "notary": {
                        "offSystem": false,
                        "onSystem": false
                    },
                    "idScan": false,
                    "optional": false,
                    "selfie": false,
                    "signature": false,
                    "weight": 0,
                    "_id": "5e81d9d6f52e300013c7e5c6",
                    "attributeType": "http://platform.selfkey.org/schema/attribute/bank-statement.json",
                    "title": "Bank Statement",
                    "description": "Bank Statement"
                }
            ],
            "options": {
                "checkerRequired": false,
                "membersEnabled": false
            }
        },
        "submission": {
            "documentTemplate": null,
            "signatureEnabled": false
        },
        "welcomeScreen": {
            "disclaimerText": "",
            "enabled": false
        },
        "active": true,
        "defaultManager": null,
        "removed": false,
        "type": "individual",
        "created": "2020-03-30T11:34:46.345Z",
        "history": [
            {
                "_id": "5e81d956f52e300013c7e5bf",
                "event": "create",
                "user": "5d25a03ff784627fe5b96918",
                "timestamp": "2020-03-30T11:34:46.365Z"
            },
            {
                "_id": "5e81d9d6f52e300013c7e5c5",
                "event": "add_requirement",
                "user": "5d25a03ff784627fe5b96918",
                "timestamp": "2020-03-30T11:36:54.789Z"
            },
            {
                "_id": "5e81d9e4f52e300013c7e5c7",
                "event": "edit",
                "user": "5d25a03ff784627fe5b96918",
                "timestamp": "2020-03-30T11:37:08.862Z"
            },
            {
                "_id": "5e81d9f3f52e300013c7e5c8",
                "event": "edit",
                "user": "5d25a03ff784627fe5b96918",
                "timestamp": "2020-03-30T11:37:23.706Z"
            }
        ],
        "legalLinks": [],
        "memberTemplates": [
            {
                "isDefault": true,
                "legalEntityTypes": [],
                "memberRoles": [
                    "director_ltd",
                    "shareholder",
                    "ubo",
                    "observer",
                    "authorizedSignatory",
                    "other",
                    "manager",
                    "member_llc",
                    "other_llc",
                    "grantor",
                    "beneficiary_tst",
                    "trustee",
                    "protector",
                    "founder",
                    "director_fnd",
                    "supervisor",
                    "beneficiary_fnd",
                    "generalPartner",
                    "limitedPartner",
                    "member"
                ],
                "_id": "5e81d956f52e300013c7e5c0",
                "memberType": "individual",
                "template": null
            }
        ],
        "name": "selfkey test",
        "description": "selfkey test",
        "scope": "608f1f77bcf86cd799438011"
    },
    "managers": [
        {
            "_id": "5e8c782aa88e7b00139f589f",
            "role": "manager",
            "user": "5d25a03ff784627fe5b96918",
            "id": "5e8c782aa88e7b00139f589f"
        }
    ],
    "members": [],
    "statusLog": [
        {
            "_id": "5e8c9eab957ad100130d4201",
            "timestamp": "2020-04-07T15:39:23.359Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c9eab957ad100130d4201"
        },
        {
            "_id": "5e8c9eab957ad100130d41ff",
            "timestamp": "2020-04-07T15:39:23.078Z",
            "code": 16,
            "id": "5e8c9eab957ad100130d41ff"
        },
        {
            "_id": "5e8c9bdba88e7b00139f5903",
            "timestamp": "2020-04-07T15:27:23.291Z",
            "code": 2,
            "id": "5e8c9bdba88e7b00139f5903"
        },
        {
            "_id": "5e8c957ca88e7b00139f5901",
            "timestamp": "2020-04-07T15:00:12.666Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c957ca88e7b00139f5901"
        },
        {
            "_id": "5e8c957ca88e7b00139f58ff",
            "timestamp": "2020-04-07T15:00:12.623Z",
            "code": 16,
            "id": "5e8c957ca88e7b00139f58ff"
        },
        {
            "_id": "5e8c9531a88e7b00139f58fd",
            "timestamp": "2020-04-07T14:58:57.525Z",
            "code": 2,
            "id": "5e8c9531a88e7b00139f58fd"
        },
        {
            "_id": "5e8c9437a88e7b00139f58fb",
            "timestamp": "2020-04-07T14:54:47.066Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c9437a88e7b00139f58fb"
        },
        {
            "_id": "5e8c9437a88e7b00139f58f9",
            "timestamp": "2020-04-07T14:54:47.010Z",
            "code": 16,
            "id": "5e8c9437a88e7b00139f58f9"
        },
        {
            "_id": "5e8c9325a88e7b00139f58f7",
            "timestamp": "2020-04-07T14:50:13.783Z",
            "code": 2,
            "id": "5e8c9325a88e7b00139f58f7"
        },
        {
            "_id": "5e8c9308a88e7b00139f58f5",
            "timestamp": "2020-04-07T14:49:44.686Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c9308a88e7b00139f58f5"
        },
        {
            "_id": "5e8c9308a88e7b00139f58f3",
            "timestamp": "2020-04-07T14:49:44.664Z",
            "code": 16,
            "id": "5e8c9308a88e7b00139f58f3"
        },
        {
            "_id": "5e8c92d1a88e7b00139f58f1",
            "timestamp": "2020-04-07T14:48:49.088Z",
            "code": 2,
            "id": "5e8c92d1a88e7b00139f58f1"
        },
        {
            "_id": "5e8c9285a88e7b00139f58ef",
            "timestamp": "2020-04-07T14:47:33.484Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c9285a88e7b00139f58ef"
        },
        {
            "_id": "5e8c9285a88e7b00139f58ec",
            "timestamp": "2020-04-07T14:47:33.437Z",
            "code": 16,
            "note": {
                "_id": "5e8c9285a88e7b00139f58eb",
                "external": false,
                "content": "application reopened",
                "owner": "5d25a03ff784627fe5b96918",
                "createdAt": "2020-04-07T14:47:33.428Z"
            },
            "id": "5e8c9285a88e7b00139f58ec"
        },
        {
            "_id": "5e8c89bfa88e7b00139f58e8",
            "timestamp": "2020-04-07T14:10:07.977Z",
            "code": 2,
            "note": {
                "_id": "5e8c89bfa88e7b00139f58e7",
                "external": false,
                "content": "I am approving this application",
                "owner": "5d25a03ff784627fe5b96918",
                "createdAt": "2020-04-07T14:10:07.975Z"
            },
            "id": "5e8c89bfa88e7b00139f58e8"
        },
        {
            "_id": "5e8c8991a88e7b00139f58e5",
            "timestamp": "2020-04-07T14:09:21.615Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c8991a88e7b00139f58e5"
        },
        {
            "_id": "5e8c8991a88e7b00139f58e2",
            "timestamp": "2020-04-07T14:09:21.596Z",
            "code": 16,
            "note": {
                "_id": "5e8c8991a88e7b00139f58e1",
                "external": false,
                "content": "application reopened",
                "owner": "5d25a03ff784627fe5b96918",
                "createdAt": "2020-04-07T14:09:21.594Z"
            },
            "id": "5e8c8991a88e7b00139f58e2"
        },
        {
            "_id": "5e8c8851a88e7b00139f58de",
            "timestamp": "2020-04-07T14:04:01.787Z",
            "code": 2,
            "note": {
                "_id": "5e8c8851a88e7b00139f58dd",
                "external": false,
                "content": "I am approving this application",
                "owner": "5d25a03ff784627fe5b96918",
                "createdAt": "2020-04-07T14:04:01.784Z"
            },
            "id": "5e8c8851a88e7b00139f58de"
        },
        {
            "_id": "5e8c8632a88e7b00139f58db",
            "timestamp": "2020-04-07T13:54:58.285Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c8632a88e7b00139f58db"
        },
        {
            "_id": "5e8c8632a88e7b00139f58d8",
            "timestamp": "2020-04-07T13:54:58.268Z",
            "code": 16,
            "note": {
                "_id": "5e8c8632a88e7b00139f58d7",
                "external": false,
                "content": "application reopened",
                "owner": "5d25a03ff784627fe5b96918",
                "createdAt": "2020-04-07T13:54:58.266Z"
            },
            "id": "5e8c8632a88e7b00139f58d8"
        },
        {
            "_id": "5e8c85c2a88e7b00139f58d4",
            "timestamp": "2020-04-07T13:53:06.752Z",
            "code": 2,
            "note": {
                "_id": "5e8c85c2a88e7b00139f58d2",
                "external": false,
                "content": "I am approving this application",
                "owner": "5d25a03ff784627fe5b96918",
                "createdAt": "2020-04-07T13:53:06.748Z"
            },
            "id": "5e8c85c2a88e7b00139f58d4"
        },
        {
            "_id": "5e8c78c3a88e7b00139f58cb",
            "timestamp": "2020-04-07T12:57:39.575Z",
            "code": 9,
            "id": "5e8c78c3a88e7b00139f58cb"
        },
        {
            "_id": "5e8c78b9a88e7b00139f58c9",
            "timestamp": "2020-04-07T12:57:29.009Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c78b9a88e7b00139f58c9"
        },
        {
            "_id": "5e8c78b8a88e7b00139f58c6",
            "timestamp": "2020-04-07T12:57:28.975Z",
            "code": 16,
            "id": "5e8c78b8a88e7b00139f58c6"
        },
        {
            "_id": "5e8c78aea88e7b00139f58c2",
            "timestamp": "2020-04-07T12:57:18.483Z",
            "code": 3,
            "id": "5e8c78aea88e7b00139f58c2"
        },
        {
            "_id": "5e8c78a9a88e7b00139f58bf",
            "timestamp": "2020-04-07T12:57:13.451Z",
            "code": 9,
            "note": null,
            "user": null,
            "id": "5e8c78a9a88e7b00139f58bf"
        },
        {
            "_id": "5e8c78a9a88e7b00139f58bc",
            "timestamp": "2020-04-07T12:57:13.431Z",
            "code": 16,
            "id": "5e8c78a9a88e7b00139f58bc"
        },
        {
            "_id": "5e8c78a2a88e7b00139f58b8",
            "timestamp": "2020-04-07T12:57:06.638Z",
            "code": 2,
            "id": "5e8c78a2a88e7b00139f58b8"
        },
        {
            "_id": "5e8c7890a88e7b00139f58b5",
            "timestamp": "2020-04-07T12:56:48.980Z",
            "code": 9,
            "id": "5e8c7890a88e7b00139f58b5"
        },
        {
            "_id": "5e8c7868a88e7b00139f58b0",
            "timestamp": "2020-04-07T12:56:08.879Z",
            "code": 4,
            "id": "5e8c7868a88e7b00139f58b0"
        },
        {
            "_id": "5e8c7840a88e7b00139f58ab",
            "timestamp": "2020-04-07T12:55:28.902Z",
            "code": 11,
            "id": "5e8c7840a88e7b00139f58ab"
        },
        {
            "_id": "5e8c783ca88e7b00139f58aa",
            "timestamp": "2020-04-07T12:55:24.543Z",
            "code": 6,
            "id": "5e8c783ca88e7b00139f58aa"
        },
        {
            "_id": "5e8c782aa88e7b00139f58a0",
            "timestamp": "2020-04-07T12:55:06.077Z",
            "code": 14,
            "id": "5e8c782aa88e7b00139f58a0"
        },
        {
            "_id": "5e8c782aa88e7b00139f589e",
            "timestamp": "2020-04-07T12:55:06.074Z",
            "code": 5,
            "id": "5e8c782aa88e7b00139f589e"
        }
    ],
    "baseApplicationId": "5e8c782aa88e7b00139f589d",
    "createdAt": "2020-04-07T12:55:06.146Z",
    "updatedAt": "2020-04-07T15:39:23.369Z",
    "currentStatus": 9,
    "id": "5e8c782aa88e7b00139f589d",
    "statusName": "In Progress"
}
```

### Update application status

You can manage the application status via the following request:

##### Node.js

```js
await client.applications.changeStatus(
    applicationId,
    client.statuses.APPROVED
);
```
##### HTTP

```bash
POST <KYCC_API_KEY>/integrations/v2/applications/<APPLICATION_ID>/status_changes

HEADERS:
apiKey: <KYCC_API_URL>
Content-Type: application/json

BODY:
{
    "code": 2
}

```

Example: [routes/index.js](https://github.com/SelfKeyFoundation/relying-party-mp-kycc-demo/blob/master/src/routes/index.js)

### Working with personal information

KYC-Chain api application is constructed from 2 sets of personal information

- Identity attributes
- Questions

#### Identity Attributes

Identity Attribute is a predefined atomic peace of information about a person. Attributes are defined with JSON Schema.

Here is the full list of currently supported identity attributes: [https://platform.selfkey.org/repository.json](https://platform.selfkey.org/repository.json)

You can also load a fully resolved list from here: [https://platform.selfkey.org/resolved-repository.json](https://platform.selfkey.org/resolved-repository.json)

##### Invalidate an Attribute

While the manager is checking the application, he can decide to invalidate an identity attribute (request to fill again).
Here is how to do it via the API

##### Node.js

```js
const attributesToInvalidate = ["5e81d956f52e300013c7e5c2", "5e81d956f52e300013c7e5c3"]
const response = await kyccClient.applications.attributes.invalidate(applicationId, attributesToInvalidate);
```

##### HTTP

```bash
POST <KYCC_API_KEY>/integrations/v2/applications/<APPLICATION_ID>/attributes/invalidate?attributes[]=5e81d956f52e300013c7e5c2&attributes[]=5e81d956f52e300013c7e5c3

HEADERS:
apiKey: <KYCC_API_URL>
```

This operation will cause the `valid` field of the attributes to become `false`

```js
[
    ...,
    "5e81d956f52e300013c7e5c2": {
        "description": "First name",
        "isAdditional": false,
        "label": "First name",
        "optional": false,
        "schema": "http://platform.selfkey.org/schema/attribute/first-name.json",
        "valid": false,
        "value": "Test"
    },
    "5e81d956f52e300013c7e5c3": {
        "description": "Middle name",
        "isAdditional": false,
        "label": "Middle name",
        "optional": true,
        "schema": "http://platform.selfkey.org/schema/attribute/middle-name.json",
        "valid": false,
        "value": "test"
    },
    ...
```

##### Request Additional Attribute

While the manager is checking the application, he can decide to request additional attributes from the customer
Here is how to do it via the API

##### Node.js

```js
const additionalAttribute = {
    "description": "Please insert an image of your fingerpring",
    "label": "Fingerprint",
    "optional": false,
    "schema": "http://platform.selfkey.org/schema/attribute/fingerprint.json"
}
const response = await kyccClient.applications.attributes.add(applicationId, additionalAttribute);
```

##### HTTP

```bash
POST <KYCC_API_KEY>/integrations/v2/applications/<APPLICATION_ID>/attributes

HEADERS:
apiKey: <KYCC_API_URL>
Content-Type: application/json

BODY:
{
    "description": "Please insert an image of your fingerpring",
    "label": "Fingerprint",
    "optional": false,
    "schema": "http://platform.selfkey.org/schema/attribute/fingerprint.json"
}
```

This operation will add a new attribute to fill in the application and it will contain a new field `isAdditional: true`

```js
[
    ...,
    "5e8de186957ad100130d426f": {
        "description": "Please insert an image of your fingerpring",
        "label": "Fingerprint",
        "optional": false,
        "schema": "http://platform.selfkey.org/schema/attribute/fingerprint.json"
        "valid": false,
        "isAdditional": true
    }
```

#### Questions

Besides Identity Attributes KYC-Chain supports general questions to be requested of the customer. Thous are generic text questions and don't have a predefined schema.

##### Invalidate a Question

While the manager is checking the application, he can decide to invalidate the answer to a question (request to answer again).
Here is how to do it via the API

##### Node.js

```js
const questionsToInvalidate = ["5e81d956f52e300013c7e5c2", "5e81d956f52e300013c7e5c3"]
const response = await kyccClient.applications.questions.invalidate(applicationId, questionsToInvalidate);
```

##### HTTP

```bash
POST <KYCC_API_KEY>/integrations/v2/applications/<APPLICATION_ID>/questions/invalidate?questions[]=5e81d956f52e300013c7e5c2&questions[]=5e81d956f52e300013c7e5c3

HEADERS:
apiKey: <KYCC_API_URL>
```

This operation will cause the `valid` field of the question to become `false`

```js
[
    ...,
    "5e81d956f52e300013c7e5c2": {
        "description": "First name",
        "isAdditional": false,
        "label": "First name",
        "optional": false,
        "question": "What is your Given Name?"
        "valid": false,
        "value": "Test",
        "type": "input"˝
    },
    "5e81d956f52e300013c7e5c3": {
        "description": "Middle name",
        "isAdditional": false,
        "label": "Middle name",
        "optional": true,
        "question": "What is your Middle Name?"
        "valid": false,
        "value": "test",
        "type": "input"
    },
    ...
```

##### Request to Answer Additional Questions

While the manager is checking the application, he can decide to request answers for additional questions from the customer
Here is how to do it via the API

##### Node.js

```js
const additionalQuestion = {
    "description": "How many fingers on the hand",
    "label": "Fingers on the Hand",
    "optional": false,
    "questions": "How many fingers do you have on your right hand?",
    "type": "select",
    "options": ["10", "20", "5", "6"]
}
const response = await kyccClient.applications.questions.add(applicationId, additionalQuestion);
```

##### HTTP

```bash
POST <KYCC_API_KEY>/integrations/v2/applications/<APPLICATION_ID>/questions

HEADERS:
apiKey: <KYCC_API_URL>
Content-Type: application/json

BODY:
{
    "description": "How many fingers on the hand",
    "label": "Fingers on the Hand",
    "optional": false,
    "questions": "How many fingers do you have on your right hand?",
    "type": "select",
    "options": ["10", "20", "5", "6"]
}
```

This operation will add a new question to fill in the application and it will contain a new field `isAdditional: true`

```js
[
    ...,
    "5e8de186957ad100130d426f": {
        "description": "How many fingers on the hand",
        "label": "Fingers on the Hand",
        "optional": false,
        "questions": "How many fingers do you have on your right hand?",
        "type": "select",
        "options": ["10", "20", "5", "6"],
        "isAdditional": true
    }
```

<a name="license"></a>

## License

[The GPL-3.0 License](http://opensource.org/licenses/GPL-3.0)

Copyright (c) 2018 SelfKey Foundation <https://selfkey.org/>
