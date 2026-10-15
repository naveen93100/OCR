import fs from 'fs'
import CardLead from '../models/cardLeadModel.js'
import { cardQueue } from '../queue/cardQueue.js';

export const createCardLead = async (file, data) => {


    let { executiveUserId } = data;

    const card = await CardLead.create({
        executiveUserId,
        imagePath: file.filename
    });

    cardQueue.add('extract-single-card', { cardId: card?._id.toString() }, { jobId: card?._id.toString() });

    return card;

}

export const createBulkCardLead = async (data) => {

    let { executiveUserId,filename } = data;

    const card = await CardLead.create({
        executiveUserId,
        imagePath: filename
    });

    cardQueue.add('extract-bulk-card', { cardId: card?._id.toString() }, { jobId: card?._id.toString() });

    return card;
}
