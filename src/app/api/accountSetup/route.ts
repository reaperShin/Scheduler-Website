import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/data/accountSetup.ts');

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.email || !data.password) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newUser = {
            id: Date.now().toString(), // Simple ID generation
            name: data.name,
            email: data.email,
            password: data.password
        };

        let fileContent = fs.readFileSync(dataFilePath, 'utf-8');

        // Check if user already exists (optional but good practice)
        // We need to parse existing data to check, but for now we'll just append as requested "like the already created one"

        const objectString = JSON.stringify(newUser, null, 2);
        const endBracketIndex = fileContent.lastIndexOf(']');

        if (endBracketIndex !== -1) {
            const isArrayEmpty = /=\s*\[\s*\]/.test(fileContent);

            if (isArrayEmpty) {
                fileContent = fileContent.replace(/=\s*\[\s*\]/, `= [\n${objectString}\n]`);
            } else {
                // Insert before the last closing bracket
                // We need to be careful about the comma. 
                // If it's the last item, we just append comma and new item.
                // However, the simple regex replacement at the end is safer if we just adhere to the structure.

                // Let's use the exact string manipulation from schedules route as a reference
                fileContent = fileContent.substring(0, endBracketIndex) + `,\n${objectString}\n]`;
            }
        }

        fs.writeFileSync(dataFilePath, fileContent, 'utf-8');
        return NextResponse.json({ message: 'Account created successfully', user: newUser });

    } catch (error) {
        console.error('Error creating account:', error);
        return NextResponse.json({ message: 'Error creating account' }, { status: 500 });
    }
}
