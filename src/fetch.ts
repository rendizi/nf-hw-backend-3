import axios from "axios";
import cheerio from "cheerio";

export interface StructuredData {
    author: string;
    title: string;
    tags: string[];
    reactions: string;
    date: string;
}

const fetchDevPosts = async (): Promise<StructuredData[]> => {
    try {
        const response = await axios.get("https://dev.to/");
        const html: string = response.data;

        const $ = cheerio.load(html);

        const posts = $(".crayons-story");
        const structuredDatas: StructuredData[] = [];

        posts.each((index, element) => {
            const author = $(element)
                .find(".profile-preview-card")
                .text()
                .trim()
                .split('\n')[0]
                .trim();

            const title = $(element)
                .find(".crayons-story__title")
                .text()
                .trim();

            const tags: string[] = [];
            $(element).find(".crayons-story__tags a.crayons-tag").each((_, tagElement) => {
                const tag = $(tagElement).text().trim().replace('#', '');
                tags.push(tag);
            });

            const reactions = $(element)
                .find(".aggregate_reactions_counter")
                .text()
                .trim();

            const date = $(element)
                .find(".crayons-story__tertiary")
                .text()
                .split('\n')[0]
                .trim();

            const structuredData: StructuredData = {
                author,
                title,
                tags,
                reactions,
                date
            };

            structuredDatas.push(structuredData);
        });

        return structuredDatas;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

export default fetchDevPosts;
