import { Request } from "express";
import { Document, FilterQuery, Model } from "mongoose";
import ResponsePayload from "./response-payload";

export default async function generatePayload<T extends Document>(
    request: Request, 
    model: Model<T>,
    searchData: FilterQuery<T>,
    sortData: {[key: string]: 'asc'|'desc'},
    projection: {[key: string]: 0|1}|null = null
): Promise<ResponsePayload<T>> {
    let total = await model.countDocuments(searchData).exec();

    if (request.query.page != null || request.query.per_page != null) {
        // Parse page and per page variables
        let page = request.query.page != null ? Math.ceil(Number(request.query.page)) : 1;
        let perPage = request.query.per_page != null ? Math.ceil(Number(request.query.per_page)) : 10;

        // Fix per page variable
        if (perPage < 1) perPage = 1;

        // Get the total number of pages
        let totalPages = Math.ceil(total / perPage);

        // No results
        if (total == 0) {
            return {
                total,
                per_page: perPage,
                current_page: 1,
                from: 0,
                to: 0,
                prev_page: null,
                next_page: null,
                data: [],
            };
        }

        // Fix the page variable
        if (page > totalPages) page = totalPages;
        else if (page < 1) page = 1;

        // Calculate the offset to start fetching records from.
        let offset = ((page - 1) * perPage);

        // Get data
        const data = await model.find(searchData, projection).sort(sortData).skip(offset).limit(perPage).exec();

        // Response
        return {
            total,
            per_page: perPage,
            current_page: page,
            from: offset + 1,
            to: offset + data.length,
            prev_page: page > 1 ? page - 1 : null,
            next_page: page < totalPages ? page + 1 : null,
            data,
        }
    } else {
        return {
            total,
            data: await model.find(searchData, projection).sort(sortData).exec()
        }
    }
}