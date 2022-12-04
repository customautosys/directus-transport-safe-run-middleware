# directus-transport-safe-run-middleware

A transport for the Directus JavaScript SDK which uses safe-run-middleware

## Copyright Notice

&copy; 2022 Wilson Foo Yu Kang. All rights reserved except as otherwise expressly provided in writing.

Licensed by Wilson Foo Yu Kang to the sole licensee Custom Automated Systems &reg; Pte Ltd on private and confidential terms which may be revoked with express written notice at any time at the sole and absolute discretion of Wilson Foo Yu Kang. By using and continuing to use this package, all parties agree that they are sub-licensing this package, including where this is pursuant to the LICENSE file containing herein, from Custom Automated Systems &reg; Pte Ltd and are not contracting directly with Wilson Foo Yu Kang, save that Wilson Foo Yu Kang shall be availed of all protections at law including all limitations of liability. Contact sales@customautosys.com for custom licensing terms.

Removal of this Copyright Notice is prohibited.

## Installation

```bash
npm i -D directus-transport-safe-run-middleware
npm i -S directus-transport-safe-run-middleware
```

## Usage

```typescript
import {Directus} from '@directus/sdk';
import {createApp} from 'directus';
import express from 'express';
import DirectusTransportSafeRunMiddleware from 'directus-transport-safe-run-middleware';

let app=express();
app.use('/directus',await createApp());

let directus=new Directus('/directus',{transport:new DirectusTransportSafeRunMiddleware()})
```