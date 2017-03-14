import GenepopReader from '../src/main'

import {assert} from 'chai'
import {createReadStream} from 'fs'

const test_dir = 'tests/data/'
const files = ['c2line.gen', 'c3line.gen', 'c2space.gen', 'c3space.gen',
                'haplo3.gen', 'haplo2.gen']

const test_files = (files: string[], done: Function) => {
    let completed = 0
    for (let file of files) {
        let my_json = ''
        console.log(file)
        const single_file = test_dir + file
        const stream = createReadStream(single_file)
        const reader = stream.pipe(new GenepopReader({}))
        reader.on('data', (data: Buffer) => {
            my_json += data.toString()
        })
        reader.on('end', () => {
            completed++
            console.log(my_json, 99)
            if (completed === files.length) done()
        })
    }
}

describe('Reader', () => {
    it('Single file - basic', (done) => {
        test_files([files[1]], done)
    })

    it('Several files - basic', (done) => {
        ///test_files(files, done)
        done()
    })
})
