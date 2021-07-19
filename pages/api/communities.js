import { SiteClient } from 'datocms-client'

export default async function handleRequest(req, res){

    if(req.method === 'POST'){
        const TOKEN = 'e036b9ad78bdffce2b5053c62c09db';
        const client = new SiteClient(TOKEN)

        const newCommunity = await client.items.create({
            itemType: "977059",
            ...req.body
        })

        res.json({
            community: newCommunity
        })

        return
    }

    res.status(404).json({
        message: 'Unauthorized'
    })

}