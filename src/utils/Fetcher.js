import mongoose from "mongoose";

export class ApiFetcher {
  constructor(pipeline, searchQuery, options = {}) {
    this.pipeline = Array.isArray(pipeline) ? pipeline : [];
    this.ApiFetcherPipeline = null;
    this.searchQuery = searchQuery;
    this.metadata = {};
    this.searchFeilds = options?.searchFeilds || [];
  }
  // Pagination method
  pagination() {
    const pageNumber = parseInt(this.searchQuery.page, 10) || 1;
    const pageLimit = parseInt(this.searchQuery.pagelimit, 10) || 20;
    const skip = (pageNumber - 1) * pageLimit;
    this.ApiFetcherPipeline = [...this.pipeline];
    this.pipeline.push({ $skip: skip }, { $limit: pageLimit });
    this.metadata = { page: pageNumber, pageLimit };
    return this;
  }
  // Filter method
  filter() {
    if (this.searchQuery.filters) {
      let query = JSON.stringify(this.searchQuery.filters);

      query = query
        // Prefix valid MongoDB operators with $
        .replace(
          /("gt":|"gte":|"lt":|"lte":|"regex":|"ne":|"eq":)/g,
          (match) => `"$${match.slice(1)}`
        )
        // Convert boolean strings to actual booleans
        .replace(/"true"|"false"/g, (match) =>
          match === '"true"' ? true : false
        )
        // Convert numeric strings to numbers
        .replace(/"(\d+)"/g, (match, num) => num)
        // Split comma-separated values into arrays
        .replace(/"([^"]+)":\s*"([^"]*?)"/g, (match, key, value) => {
          if (value.includes(",")) {
            const arrayValues = value.split(",").map((item) => item.trim());
            return `"${key}": { "$in": ${JSON.stringify(arrayValues)} }`;
          }
          return `"${key}": "${value}"`;
        });

      // Parse the modified JSON string back to an object
      query = JSON.parse(query);

      if (Object.keys(query)?.length) {
        this.pipeline.push({ $match: query });
      }
    }
    return this;
  }

  // Sort method
  sort() {
    if (this.searchQuery.sort) {
      const sortBy = `${this.searchQuery?.sort},_id:asc`
        ?.split(",")
        ?.reduce((acc, field) => {
          const [key, order] = field.split(":");
          acc[key] = order === "desc" ? -1 : 1;
          return acc;
        }, {});
      this.pipeline.push({ $sort: sortBy });
    } else {
      this.pipeline.push({ $sort: { _id: -1 } }); // Default sort order
    }
    return this;
  }
  // Select method
  select() {
    if (this.searchQuery.fields) {
      try {
        const fields = this.searchQuery.fields
          .split(",")
          .filter(Boolean)
          .reduce((acc, field) => {
            if (field.startsWith("-")) {
              acc[field.substring(1)] = 0; // Exclude field
            } else {
              acc[field] = 1; // Include field
            }
            return acc;
          }, {});
        this.pipeline.push({ $project: fields });
      } catch (e) {}
    }
    return this;
  }

  // Search method
  search() {
    if (this.searchQuery.search) {
      const indexQueries = this?.searchFeilds.map((key) => ({
        [key]: { $regex: this.searchQuery.search, $options: "i" },
      }));
      if (indexQueries.length) {
        this.pipeline.push({ $match: { $or: indexQueries } });
      }
    }
    return this;
  }
  // Populate method
  populate(populateArray) {
    if (Array.isArray(populateArray) && populateArray.length) {
      populateArray.forEach((pop) => {
        this.pipeline.push({
          $lookup: {
            from: pop.from,
            localField: pop.localField,
            foreignField: pop.foreignField,
            as: pop.as,
          },
        });
        if (pop.unwind) {
          this.pipeline.push({ $unwind: `$${pop.as}` });
        }
      });
    }
    return this;
  }
  // Method to get total count of documents after applying filters
  async count(model) {
    const pipeline = this?.ApiFetcherPipeline;
    if (!pipeline) return 0;
    const result = await model
      .aggregate([...pipeline, { $count: "totalCount" }])
      .exec();
    return result.length ? result[0].totalCount : 0;
  }
}
