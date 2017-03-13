import GenepopReader from '../src/main'

import {assert} from 'chai'
import {createReadStream} from 'fs'

describe('Reader', () => {
    it('Simple', () => {
        let stream = createReadStream('tests/data/c2line.gen')
        //stream.pipe(process.stdout)
        stream.pipe(new GenepopReader({})).pipe(process.stdout)
    })
})

