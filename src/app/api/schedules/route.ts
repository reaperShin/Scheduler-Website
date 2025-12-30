import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/data/schedules.ts');

export async function GET() {
    try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        const match = fileContent.match(/export const schedules: Schedule\[\] = (\[[\s\S]*\]);/);

        if (match && match[1]) {
            // Clean up the string to be valid JSON (removing trailing commas if strict JSON parse is needed, though simple regex below handles arrays)
            try {
                // Simple heuristic: JSON.parse works if the content is valid JSON. 
                // Our POST writes valid JSON objects.
                // We might need to ensure trailing commas in the array don't break it.
                // TS allows trailing commas, JSON does not.
                // Let's strip trailing comma before the closing bracket.
                const jsonStr = match[1].replace(/,\s*\]$/, ']');
                const data = JSON.parse(jsonStr);
                return NextResponse.json(data);
            } catch (e) {
                console.error("Manual parse failed", e);
                return NextResponse.json([]);
            }
        }
        return NextResponse.json([]);
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const items = Array.isArray(data) ? data : [data];

        let fileContent = fs.readFileSync(dataFilePath, 'utf-8');

        for (const item of items) {
            const objectString = JSON.stringify(item, null, 2);
            // Find where to insert
            const endBracketIndex = fileContent.lastIndexOf('];');
            if (endBracketIndex !== -1) {
                const isArrayEmpty = /=\s*\[\s*\];/.test(fileContent);
                if (isArrayEmpty) {
                    fileContent = fileContent.replace(/=\s*\[\s*\];/, `= [\n${objectString}\n];`);
                } else {
                    // Append with comma
                    fileContent = fileContent.substring(0, endBracketIndex) + `,\n${objectString}\n];`;
                }
            }
        }

        fs.writeFileSync(dataFilePath, fileContent, 'utf-8');
        return NextResponse.json({ message: 'Saved' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}
