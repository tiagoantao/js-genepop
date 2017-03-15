import GenepopReader from '../src/main'

import {assert} from 'chai'
import {createReadStream} from 'fs'

const test_dir = 'tests/data/'
const files = ['c2line.gen', 'c3line.gen', 'c2space.gen', 'c3space.gen',
                'haplo3.gen', 'haplo2.gen']


const _get_representation = (jsons : any) => {
    let rec : any = {pops: []}
    for (let json of jsons.split('\n')) {
        if (json === '') continue
        let gp = JSON.parse(json)
        switch (gp.what) {
            case 'title':
                rec.title = gp.val
                break
            case 'loci':
                rec.loci = gp.val
                break
            case 'pop':
                rec.pops.push([])
                break
            case 'ind':
                let my_pop = rec.pops[rec.pops.length - 1]
                let ind = {ind: 0, geno: []}
                ind.ind = gp.ind
                ind.geno = gp.geno
                my_pop.push(ind)
                break
        }
    }
    return rec
}


const _test_files = (files: string[], done: Function, testf: Function) => {
    let completed = 0
    for (let file of files) {
        let my_json = ''
        const single_file = test_dir + file
        const stream = createReadStream(single_file)
        const reader = stream.pipe(new GenepopReader({}))
        reader.on('data', (data: Buffer) => {
            my_json += data.toString()
        })
        reader.on('end', () => {
            completed++
            testf(file, _get_representation(my_json))
            if (completed === files.length) done()
        })
    }
}


describe('Reader', () => {
    it('Single file - basic', (done) => {
        _test_files([files[5]], done, (fname: string, rec: any) => {
            console.log(fname, rec)

        })
    })

    it('Haploid testing', (done) => {
        _test_files([files[4]], done, (fname: string, rec: any) => {
            
        })
    })

    it('Several files - basic', (done) => {
        _test_files(files, done, (fname: string, rec: any) => {
            
        })
    })
})
