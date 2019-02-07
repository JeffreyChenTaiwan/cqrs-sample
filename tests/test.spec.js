'use strict';

const path = require('path');
const domain = require('cqrs-domain')({
    domainPath: path.join(process.cwd(), 'src/domain/lib')
});

domain.defineCommand({
    id: 'id',
    name: 'command',
    aggregateId: 'payload.id',
    payload: 'payload',
    revision: 'head.revision',
    meta: 'meta',
});
domain.defineEvent({
    correlationId: 'commandId',
    id: 'id',
    name: 'event',
    aggregateId: 'payload.id',
    payload: 'payload',
    revision: 'head.revision',
    meta: 'meta',
});

function init(mock) {
    return new Promise((resolve, reject) => {
        domain.init(function (err) {
            if (err) {
                reject(err);
            }

            domain.onEvent(function (evt) {
                mock(evt);
            });

            resolve(domain);
        });
    });
}

function handleCommand(cmd) {
    return new Promise((resolve, reject) => {
        domain.handle(cmd, err => {
            if (err) {
                reject(err);
            }
            resolve()
        });
    });
}


describe('Domain', () => {
    const command = { id: 'msg1', command: 'createItem', payload: { text: 'some text' } };
    const mock = jest.fn();
    it('Should process createItem command', async () => {
        await init(mock);
        await handleCommand(command);
        expect(mock).toHaveBeenCalledWith(expect.objectContaining({
            commandId: 'msg1',
            event: 'itemCreated'
        }));
    });
});
