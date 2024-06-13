import { StructuredData } from "./fetch";

export interface AnalysisResult {
    totalPosts: number;
    totalReactions: number;
    averageReactionsPerPost: number;
    popularTags: string[];
}

export function analyzeData(data: StructuredData[]): AnalysisResult {
    let totalPosts = data.length;
    let totalReactions = 0;
    let tagCounts: { [tag: string]: number } = {};

    data.forEach(post => {
        if (post.reactions){
        totalReactions += post.reactions;}

        post.tags.forEach(tag => {
            if (tagCounts[tag]) {
                tagCounts[tag]++;
            } else {
                tagCounts[tag] = 1;
            }
        });
    });

    const popularTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 10);

    return {
        totalPosts,
        totalReactions,
        averageReactionsPerPost: totalPosts > 0 ? totalReactions / totalPosts : 0,
        popularTags
    };
}
