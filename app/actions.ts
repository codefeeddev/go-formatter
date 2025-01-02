'use server'

import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

const execAsync = promisify(exec)

export async function formatGoCode(code: string) {
  try {
    // Create a temporary file with the Go code
    const tempFile = join('/tmp', `${nanoid()}.go`)
    await writeFile(tempFile, code)

    // Run gofmt on the temporary file
    const { stdout, stderr } = await execAsync(`gofmt ${tempFile}`)

    // Clean up the temporary file
    await unlink(tempFile)

    if (stderr) {
      return { error: stderr }
    }

    return { formattedCode: stdout }
  } catch (error) {
    return { error: 'コードのフォーマット中にエラーが発生しました。' }
  }
}

