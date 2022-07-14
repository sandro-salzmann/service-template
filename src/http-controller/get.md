# Show Example Info

Get detail info about an Example.

**URL** : `/api/v1/examples/:_id`

**Method** : `GET`

**Permissions required** : None

**Request Data**

Constraints: `/api/v1/examples/[uuidv4]`

Example: `/api/v1/examples/d0dd83ab-077d-40e1-aa11-5abf9cfb8c23`

## Success Response

**Code** : `200 SUCCESS`

**Content example**

```json
{
    "_id": 123,
    "name": "Build something project dot com",
    "url": "http://testserver/api/accounts/123/"
}
```

## Error Responses

**Code** : `400 BAD REQUEST`

**Response data**

```json
{
    "msg": "Invalid id." | "No id supplied."
}
```

**Code** : `404 NOT FOUND`

**Response data**

```json
{
    "msg": "Example with id not found."
}
```
