<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-900">
<div class="max-w-4xl mx-auto py-12">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="px-6 py-8">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold">Facture</h2>
                    <p>Facture #: {{ $order->id }}</p>
                    <p>Créée le: {{ $order->date }}</p>
                </div>
                <div class="text-right">
                    <h3 class="text-xl font-semibold">Entreprise: Ping Pong</h3>
                </div>
            </div>
            <div class="mt-6">
                <h4 class="text-lg font-semibold">Client:</h4>
                <p>{{ $order->client->name }}</p>
            </div>
            <div class="mt-6">
                <table class="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th class="py-2 px-4 bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-left">Article</th>
                        <th class="py-2 px-4 bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-right">Prix</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($order->pieces as $piece)
                        <tr>
                            <td class="py-2 px-4 border-b border-gray-200">{{ $piece->piece->name }} ({{ $piece->quantity }} x {{ $piece->price }}€)</td>
                            <td class="py-2 px-4 border-b border-gray-200 text-right">{{ $piece->quantity * $piece->price }}€</td>
                        </tr>
                    @endforeach
                    </tbody>
                    <tfoot>
                    <tr>
                        <td class="py-2 px-4 border-t border-gray-200 text-right font-bold">Total:</td>
                        <td class="py-2 px-4 border-t border-gray-200 text-right font-bold">{{ $order->pieces->sum(fn($piece) => $piece->quantity * $piece->price) }}€</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
