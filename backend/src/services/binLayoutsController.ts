import { Express } from 'express';
import { getLayout } from './layoutUpdateService';
import { pipe, tap } from 'hmi/src/utility/pipe';
import { matchNone, matchSome } from 'hmi/src/utility/optional';

export function binLayoutController(app: Express) {
    app.get('/api/bin-layouts/:layoutId', (req, res) => {
        pipe(
            getLayout(req.params.layoutId),
            tap(console.log),
            matchSome(layout => res.json(layout)),
            matchNone(() => { 
                res.status(404).send(`LayoutId (${req.params.layoutId}) not found.`) })
        )
            
    });
}