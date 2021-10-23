const emialReset = (code: string) => {

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body style="text-align: center;">
    <h2>App Notataion</h2>
    <p>Código de recuperação se senha:</p>
    <h1>${code}</h1>
    <p>Não compartilhe este código com ninguém</p>
</body>
</html>`
}
export { emialReset }