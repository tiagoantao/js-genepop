import * as fs from 'fs'
import * as stream from 'stream'

/**
 * A streamed parser of Genepop files.
 * 
 * @export
 * @class GenepopReader
 * @extends {stream.Transform}
 */
export default class GenepopReader extends stream.Transform {
    _str_buffer: string
    _state: string
    _loci: string[]

    constructor (options: any) {
        super(options)
        this._str_buffer = ''
        this._state = 'start'
        this._loci = []
    }

    _transform(chunk : Buffer, encoding : string, callback : Function) {
        const do_ind = (line: string) => {
            let top_toks : string[]
            let geno : string[]
            let alleles : string[][]
            top_toks = line.split(',')
            let ind : string = top_toks[0]
            geno = top_toks[1].split(/\s+/).filter((v) => v !== '')
            alleles = geno.map((geno) => {
                let a1, a2: string
                let len: number
                len = geno.length
                a1 = geno.slice(0, len/2)
                a2 = geno.slice(len/2)
                return [a1, a2]
            })
            this.push(JSON.stringify({
                what: 'ind',
                ind: ind,
                geno: alleles}) + '\n')

        }
        const str = this._str_buffer + chunk.toString()
        const str_list = str.split('\n')
        for (let line of str_list) {
            switch (this._state) {
                case 'start':
                    this.push(JSON.stringify({what: 'title', val: line}) + '\n')
                    this._state = 'loci'
                    break
                case 'loci':
                    if (line.indexOf(',') === -1) {
                        if (line.toLowerCase() === 'pop') {
                            this._state = 'pop'
                            break
                        }
                        this._loci.push(line)
                    }
                    else {
                        this._loci = line.split(',')
                        this._state = 'pop'
                    }
                    break
                case 'pop':
                    if (this._loci.length > 0) {
                        this.push(JSON.stringify({what: 'loci', val: this._loci}) + '\n')
                        this._loci = []                    
                    }
                    this.push(JSON.stringify({what: 'pop'}) + '\n')
                    this._state = 'ind'
                    do_ind(line)
                    break
                case 'ind':
                    if (line.toLowerCase() === 'pop') {
                            this._state = 'pop'
                            break
                    }
                    do_ind(line)
            }
        }
        this.push(null)
        callback()
    }

}
