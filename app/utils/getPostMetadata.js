import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function getPostMetadata(folderName) {
    const folder = path.join(process.cwd(), folderName)
    const files = fs.readdirSync(folder)
    const markdownPosts = files.filter(file => file.endsWith('.md'))

    // get the file data
    const posts = markdownPosts.map((filename) => {
        const fileContents = fs.readFileSync(`${folder}/${filename}`, 'utf8')
        const matterResult = matter(fileContents)
        return {
            title: matterResult.data.title,
            subtitle: matterResult.data.subtitle,
            date: matterResult.data.date,
            slug: filename.replace('.md', ''),
            peek: matterResult.data.peek
        }
    })

    return posts.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}