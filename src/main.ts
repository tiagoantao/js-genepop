import * as fs from 'fs'
import * as stream from 'stream'

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

    _transform(chunk: Buffer, encoding: string, callback: Function) {
        console.log(33)
        const str = this._str_buffer + chunk.toString()
        const str_list = str.split('\n')
        for (let line of str_list) {
            switch (this._state) {
                case 'start':
                    this.push(JSON.stringify({what: 'title', val: line}))
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
                        this.push(JSON.stringify({what: 'loci', val: this._loci}))
                        this._loci = []                    
                    }
                    //XXX continues
                    break
            }
        }
        this.push(null)
        callback()
    }

}