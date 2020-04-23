/**
 * d-path-parser - v1.0.0
 * by Massimo Artizzu (MaxArt2501)
 *
 * https://github.com/MaxArt2501/d-path-parser
 *
 * Licensed under the MIT License
 * See LICENSE for details
 */
const re = {
    command: /\s*([achlmqstvz])/gi,
    number: /\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/gi,
    comma: /\s*(?:(,)|\s)/g,
    flag: /\s*([01])/g,
};

function dPathParser(d)
{
    let index = 0;
    const commands = [];

    const get = (what, must) =>
    {
        re[what].lastIndex = index;
        const res = re[what].exec(d);

        if (!res || res.index !== index)
        {
            if (!must) return null;
            throw Error(`Expected ${what} at position ${index}`);
        }

        index = re[what].lastIndex;

        return res[1];
    };

    const matchers = {
        number: (must) => Number(get('number', must)),
        'coordinate pair': (must) =>
        {
            const x = get('number', must);

            if (x === null && !must) return null;
            get('comma');
            const y = get('number', true);

            return { x: Number(x), y: Number(y) };
        },
        'arc definition': (must) =>
        {
            const radii = matchers['coordinate pair'](must);

            if (!radii && !must)
            {
                return null;
            }
            get('comma');
            const rotation = Number(get('number', true));

            get('comma', true);
            const large = !!Number(get('flag', true));

            get('comma');
            const clockwise = !!Number(get('flag', true));

            get('comma');
            const end = matchers['coordinate pair'](true);

            return {
                radii,
                rotation,
                large,
                clockwise,
                end,
            };
        },
    };

    const getSequence = (what) =>
    {
        const sequence = [];
        let matched;
        let must = true;

        // eslint-disable-next-line no-cond-assign
        while (matched = matchers[what](must))
        {
            sequence.push(matched);
            must = !!get('comma');
        }

        return sequence;
    };

    while (index < d.length)
    {
        let cmd = get('command');
        const upcmd = cmd.toUpperCase();
        const relative = cmd !== upcmd;
        let sequence;

        switch (upcmd)
        {
            case 'M':
                sequence = getSequence('coordinate pair').map((coords, i) =>
                {
                    if (i === 1) cmd = relative ? 'l' : 'L';

                    return { end: coords, code: cmd, relative };
                });
                break;
            case 'L':
            case 'T':
                sequence = getSequence('coordinate pair').map((coords) =>
                    ({ end: coords, code: cmd, relative }),
                );
                break;
            case 'C':
                sequence = getSequence('coordinate pair');
                if (sequence.length % 3)
                {
                    throw Error(`Expected coordinate pair triplet at position ${index}`);
                }

                sequence = sequence.reduce((seq, coords, i) =>
                {
                    const rest = i % 3;

                    if (!rest)
                    {
                        seq.push({ cp1: coords, code: cmd, relative });
                    }
                    else
                    {
                        const last = seq[seq.length - 1];

                        last[rest === 1 ? 'cp2' : 'end'] = coords;
                    }

                    return seq;
                }, []);

                break;
            case 'Q':
            case 'S':
                sequence = getSequence('coordinate pair');

                if (sequence.length & 1)
                {
                    throw Error(`Expected coordinate pair couple at position ${index}`);
                }

                sequence = sequence.reduce((seq, coords, i) =>
                {
                    const odd = i & 1;

                    if (!odd)
                    {
                        seq.push({ cp: coords, code: cmd, relative });
                    }
                    else
                    {
                        const last = seq[seq.length - 1];

                        last.end = coords;
                    }

                    return seq;
                }, []);

                break;
            case 'H':
            case 'V':
                sequence = getSequence('number').map((value) =>
                    ({ value, code: cmd, relative }),
                );
                break;
            case 'A':
                sequence = getSequence('arc definition').map((obj) =>
                    Object.assign({ code: cmd, relative }, obj),
                );
                break;
            case 'Z':
                sequence = [{ code: 'Z' }];
                break;
        }
        commands.push.apply(commands, sequence);
    }

    return commands;
}

export { dPathParser };
