
export interface ISend {
    to: string
}

export const mailService = {
    async send(data: ISend): Promise<void> {
        await fetch('http://localhost:3000/api/send-email', {
            method: 'POST',
            body: JSON.stringify({ data })
        })
            .then(response => {
                if (response.ok) {
                    console.log(`Email send successed to ${data.to}`)
                }
            })
            .catch(err => {
                console.error(err)
            });
    }
}