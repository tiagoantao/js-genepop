import GenepopReader from '../src/main'

import {assert} from 'chai'
import {createReadStream} from 'fs'

describe('Reader', () => {
    it('Simple', () => {
        let stream = createReadStream('tests/data/c2line.gen')
        let reader = stream.pipe(new GenepopReader({}))
        reader.on('data', (data : Buffer) => {
            console.log(1, data.toString())
        })
    })
})
