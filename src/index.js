import { RawSource } from "webpack-sources";
import { Feed } from "feed";
import MarkdownHandler from 'markdown-handler';


export default class MarkdownRSSGeneratorPlugin {
    constructor(options = {}) {
        this.options = Object.assign(
            {
                title: "Sporule",
                outputPath: "rss.xml",
                description: "Sporule is a micro blog site",
                link: "https://www.sporule.com",
                language: "en",
                image: "https://i.imgur.com/vfh3Une.png",
                favicon: "https://i.imgur.com/vfh3Une.png",
                copyright: "All rights reserved 2019, Sporule",
                updated: new Date(),
                generator: "Sporule",
                author: {
                    name: "Sporule",
                    email: "example@example.com",
                    link: "https://www.sporule.com"
                },
                route: "/items",
                useAtom: true
            },
            options
        );
    }

    sortPost = (mds, isDesc = true) => {
        mds = mds.sort((a, b) => {
            let dateA = new Date(a.metas.date);
            let dateB = new Date(b.metas.date);
            return isDesc ? dateB - dateA : dateA - dateB;
        })
        return mds;
    }

    removeFuturePosts = (mds) => {
        //remove future and posts with no date
        mds = mds.filter(post => {
            if (post.metas.date && post.metas.date != "null") {
                return new Date(post.metas.date) <= new Date();
            }
            return false;
        })
        return mds;
    }

    apply(compiler) {
        // Specify the event hook to attach to
        compiler.hooks.emit.tapAsync(
            'RSSGeneratorPlugin',
            (compilation, callback) => {
                let mds = [];
                let mdHandler = new MarkdownHandler();
                let regex = /.*\.md$/gm;
                for (let path in compilation.assets) {
                    if (path.search(regex) >= 0) {
                        let md = compilation.assets[path].source().toString();
                        mds.push(mdHandler.parseContent(path, md));
                    }
                }
                let feed = new Feed({
                    title: this.options.title,
                    description: this.options.description,
                    id: this.options.link + "/",
                    link: this.options.link + "/",
                    language: this.options.language,
                    image: this.options.image,
                    favicon: this.options.favicon,
                    copyright: this.options.copyright,
                    updated: this.options.updated,
                    generator: this.options.generator,
                    author: this.options.author
                });
                mds = this.removeFuturePosts(mds);
                mds = this.sortPost(mds, true);
                mds.forEach(md => {
                    let image = md.metas.coverimage.includes("http") ? md.metas.coverimage : this.options.link + md.metas.coverimage;
                    feed.addItem({
                        title: md.title.toUpperCase(),
                        id: this.options.link + md.path.replace(".md", "").replace("posts", this.options.route),
                        link: this.options.link + md.path.replace(".md", "").replace("posts", this.options.route),
                        description: md.excerpt,
                        content: md.excerpt,
                        date: new Date(md.metas.date),
                        image: image
                    })
                })
                let feedContent = this.options.useAtom ? feed.atom1() : feed.rss2();
                compilation.assets[this.options.outputPath] = new RawSource(feedContent);
                callback();
            }
        );


    }
}