<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Plan - {{ $businessBackground->name }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
        }

        @page {
            margin: 2cm;
        }

        /* Watermark untuk versi free */
        @if(!$isPro)
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80pt;
            font-weight: bold;
            color: rgba(200, 200, 200, 0.2);
            z-index: -1;
            white-space: nowrap;
        }
        @endif

        /* Header */
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 3px solid #16a34a;
            margin-bottom: 30px;
        }

        .header .logo {
            max-width: 120px;
            max-height: 120px;
            margin-bottom: 15px;
        }

        .header h1 {
            color: #16a34a;
            font-size: 28pt;
            margin-bottom: 5px;
        }

        .header h2 {
            color: #666;
            font-size: 18pt;
            font-weight: normal;
        }

        .header .company-info {
            margin-top: 10px;
            font-size: 10pt;
            color: #666;
        }

        /* Cover Page */
        .cover-page {
            page-break-after: always;
            text-align: center;
            padding-top: 100px;
        }

        .cover-page .logo-large {
            max-width: 200px;
            max-height: 200px;
            margin-bottom: 30px;
        }

        .cover-page h1 {
            font-size: 36pt;
            color: #16a34a;
            margin-bottom: 20px;
        }

        .cover-page h2 {
            font-size: 24pt;
            color: #333;
            margin-bottom: 50px;
        }

        .cover-page .meta-info {
            margin-top: 100px;
            font-size: 12pt;
            color: #666;
        }

        /* Section Styles */
        .section {
            page-break-inside: avoid;
            margin-bottom: 30px;
        }

        .section-title {
            background-color: #16a34a;
            color: white;
            padding: 12px 15px;
            font-size: 16pt;
            margin-bottom: 20px;
            border-radius: 3px;
        }

        .subsection-title {
            color: #16a34a;
            font-size: 14pt;
            margin-top: 20px;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e5e7eb;
        }

        /* Info Box */
        .info-box {
            background-color: #f9fafb;
            border-left: 4px solid #16a34a;
            padding: 15px;
            margin: 15px 0;
            border-radius: 3px;
        }

        .info-box h3 {
            color: #16a34a;
            font-size: 12pt;
            margin-bottom: 8px;
        }

        .info-box p {
            margin: 5px 0;
            font-size: 10pt;
        }

        /* Grid Layout */
        .grid-2 {
            display: table;
            width: 100%;
            margin: 15px 0;
        }

        .grid-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            padding: 0 10px;
        }

        /* Badge Styles */
        .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 9pt;
            font-weight: bold;
            margin: 5px 5px 5px 0;
        }

        .badge-green {
            background-color: #dcfce7;
            color: #166534;
        }

        .badge-blue {
            background-color: #dbeafe;
            color: #1e40af;
        }

        .badge-yellow {
            background-color: #fef9c3;
            color: #854d0e;
        }

        .badge-purple {
            background-color: #f3e8ff;
            color: #6b21a8;
        }

        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10pt;
        }

        table th {
            background-color: #16a34a;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }

        table td {
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
        }

        table tr:nth-child(even) {
            background-color: #f9fafb;
        }

        /* Card for Vision, Mission, Values */
        .card {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }

        .card h3 {
            color: #16a34a;
            margin-bottom: 10px;
            font-size: 12pt;
        }

        .card p {
            color: #333;
            line-height: 1.8;
        }

        /* Product/Service Card */
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            page-break-inside: avoid;
        }

        .product-card .product-image {
            max-width: 150px;
            max-height: 150px;
            float: right;
            margin-left: 15px;
            border-radius: 5px;
        }

        .product-card h4 {
            color: #16a34a;
            font-size: 12pt;
            margin-bottom: 8px;
        }

        /* Team Member Card */
        .team-card {
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            page-break-inside: avoid;
        }

        .team-card .team-photo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            float: left;
            margin-right: 15px;
            object-fit: cover;
        }

        .team-card h4 {
            color: #16a34a;
            font-size: 12pt;
            margin-bottom: 5px;
        }

        .team-card .position {
            color: #666;
            font-style: italic;
            margin-bottom: 8px;
        }

        /* List Styles */
        ul {
            margin: 10px 0 10px 20px;
        }

        li {
            margin: 5px 0;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #999;
            padding: 10px 0;
            border-top: 1px solid #e5e7eb;
        }

        /* Page Break */
        .page-break {
            page-break-after: always;
        }

        /* Clearfix */
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
</head>
<body>
    <!-- Watermark for Free Version -->
    @if(!$isPro)
    <div class="watermark">SMARTPLAN FREE</div>
    @endif

    <!-- Cover Page -->
    <div class="cover-page">
        @if($logoBase64)
            <img src="{{ $logoBase64 }}" alt="Logo" class="logo-large">
        @endif

        <h1>BUSINESS PLAN</h1>
        <h2>{{ $businessBackground->name }}</h2>

        <div class="meta-info">
            <p><strong>Kategori:</strong> {{ $businessBackground->category }}</p>
            <p><strong>Tipe Bisnis:</strong> {{ $businessBackground->business_type }}</p>
            @if($businessBackground->location)
                <p><strong>Lokasi:</strong> {{ $businessBackground->location }}</p>
            @endif
            <p style="margin-top: 30px;"><strong>Dibuat pada:</strong> {{ $generatedAt }}</p>
        </div>
    </div>

    <!-- Table of Contents -->
    <div class="section">
        <h2 class="section-title">DAFTAR ISI</h2>
        <div style="padding: 20px;">
            <p style="margin: 10px 0;"><strong>1. Latar Belakang Bisnis</strong> .................... 3</p>
            <p style="margin: 10px 0;"><strong>2. Analisis Pasar</strong> .................... 5</p>
            <p style="margin: 10px 0;"><strong>3. Produk & Layanan</strong> .................... 7</p>
            <p style="margin: 10px 0;"><strong>4. Strategi Pemasaran</strong> .................... 9</p>
            <p style="margin: 10px 0;"><strong>5. Rencana Operasional</strong> .................... 11</p>
            <p style="margin: 10px 0;"><strong>6. Struktur Tim</strong> .................... 13</p>
            <p style="margin: 10px 0;"><strong>7. Rencana Keuangan</strong> .................... 15</p>
        </div>
    </div>

    <div class="page-break"></div>

    <!-- 1. Business Background -->
    <div class="section">
        <h2 class="section-title">1. LATAR BELAKANG BISNIS</h2>

        <!-- Business Info -->
        <div class="info-box">
            <h3>Informasi Perusahaan</h3>
            <table style="border: none;">
                <tr>
                    <td style="border: none; width: 30%;"><strong>Nama Bisnis:</strong></td>
                    <td style="border: none;">{{ $businessBackground->name }}</td>
                </tr>
                <tr>
                    <td style="border: none;"><strong>Kategori:</strong></td>
                    <td style="border: none;">
                        <span class="badge badge-green">{{ $businessBackground->category }}</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: none;"><strong>Tipe Bisnis:</strong></td>
                    <td style="border: none;">
                        <span class="badge badge-blue">{{ $businessBackground->business_type }}</span>
                    </td>
                </tr>
                @if($businessBackground->location)
                <tr>
                    <td style="border: none;"><strong>Lokasi:</strong></td>
                    <td style="border: none;">{{ $businessBackground->location }}</td>
                </tr>
                @endif
                @if($businessBackground->start_date)
                <tr>
                    <td style="border: none;"><strong>Tanggal Mulai:</strong></td>
                    <td style="border: none;">{{ \Carbon\Carbon::parse($businessBackground->start_date)->format('d F Y') }}</td>
                </tr>
                @endif
                @if($businessBackground->contact)
                <tr>
                    <td style="border: none;"><strong>Kontak:</strong></td>
                    <td style="border: none;">{{ $businessBackground->contact }}</td>
                </tr>
                @endif
            </table>
        </div>

        <!-- Description -->
        <h3 class="subsection-title">Deskripsi Bisnis</h3>
        <p style="text-align: justify; margin: 15px 0;">{{ $businessBackground->description }}</p>

        <!-- Purpose -->
        @if($businessBackground->purpose)
        <h3 class="subsection-title">Tujuan Bisnis</h3>
        <p style="text-align: justify; margin: 15px 0;">{{ $businessBackground->purpose }}</p>
        @endif

        <!-- Vision & Mission -->
        <div class="grid-2">
            <div class="grid-col">
                @if($businessBackground->vision)
                <div class="card">
                    <h3>Visi</h3>
                    <p>{{ $businessBackground->vision }}</p>
                </div>
                @endif
            </div>
            <div class="grid-col">
                @if($businessBackground->mission)
                <div class="card">
                    <h3>Misi</h3>
                    <p>{{ $businessBackground->mission }}</p>
                </div>
                @endif
            </div>
        </div>

        <!-- Values -->
        @if($businessBackground->values)
        <h3 class="subsection-title">Nilai-Nilai Perusahaan</h3>
        <div class="card" style="background-color: #faf5ff; border-color: #e9d5ff;">
            <p>{{ $businessBackground->values }}</p>
        </div>
        @endif
    </div>

    <div class="page-break"></div>

    <!-- 2. Market Analysis -->
    @if($marketAnalyses->isNotEmpty())
    <div class="section">
        <h2 class="section-title">2. ANALISIS PASAR</h2>

        @foreach($marketAnalyses as $analysis)
        <div style="margin-bottom: 30px;">
            <h3 class="subsection-title">{{ $analysis->market_segment }}</h3>

            <div class="info-box">
                <p><strong>Target Pasar:</strong> {{ $analysis->target_market }}</p>
                <p><strong>Ukuran Pasar:</strong> {{ $analysis->market_size }}</p>
                <p><strong>Tren Pasar:</strong> {{ $analysis->market_trends }}</p>
            </div>

            @if($analysis->description)
            <p style="text-align: justify; margin: 15px 0;">{{ $analysis->description }}</p>
            @endif

            <!-- Competitors -->
            @if($analysis->competitors && $analysis->competitors->isNotEmpty())
            <h4 style="color: #16a34a; margin-top: 15px; margin-bottom: 10px;">Analisis Kompetitor</h4>
            <table>
                <thead>
                    <tr>
                        <th>Nama Kompetitor</th>
                        <th>Kekuatan</th>
                        <th>Kelemahan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($analysis->competitors as $competitor)
                    <tr>
                        <td><strong>{{ $competitor->name }}</strong></td>
                        <td>{{ $competitor->strengths }}</td>
                        <td>{{ $competitor->weaknesses }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    <div class="page-break"></div>

    <!-- 3. Products & Services -->
    @if($productServices->isNotEmpty())
    <div class="section">
        <h2 class="section-title">3. PRODUK & LAYANAN</h2>

        @foreach($productServices as $product)
        <div class="product-card clearfix">
            @if(isset($product->image_base64))
                <img src="{{ $product->image_base64 }}" alt="{{ $product->name }}" class="product-image">
            @endif

            <h4>{{ $product->name }}</h4>
            <p><span class="badge badge-yellow">{{ $product->category }}</span></p>

            <p style="margin: 10px 0;"><strong>Deskripsi:</strong></p>
            <p style="text-align: justify;">{{ $product->description }}</p>

            @if($product->price)
            <p style="margin: 10px 0;"><strong>Harga:</strong> Rp {{ number_format($product->price, 0, ',', '.') }}</p>
            @endif

            @if($product->features)
            <p style="margin: 10px 0;"><strong>Fitur:</strong></p>
            <p>{{ $product->features }}</p>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    <div class="page-break"></div>

    <!-- 4. Marketing Strategy -->
    @if($marketingStrategies->isNotEmpty())
    <div class="section">
        <h2 class="section-title">4. STRATEGI PEMASARAN</h2>

        @foreach($marketingStrategies as $strategy)
        <div style="margin-bottom: 25px;">
            <h3 class="subsection-title">{{ $strategy->strategy_name }}</h3>

            <div class="info-box">
                <p><strong>Channel:</strong> <span class="badge badge-blue">{{ $strategy->channel }}</span></p>
                @if($strategy->budget)
                <p><strong>Budget:</strong> Rp {{ number_format($strategy->budget, 0, ',', '.') }}</p>
                @endif
                @if($strategy->timeline)
                <p><strong>Timeline:</strong> {{ $strategy->timeline }}</p>
                @endif
            </div>

            @if($strategy->description)
            <p style="text-align: justify; margin: 15px 0;">{{ $strategy->description }}</p>
            @endif

            @if($strategy->expected_outcome)
            <p><strong>Target Hasil:</strong></p>
            <p style="margin: 10px 0;">{{ $strategy->expected_outcome }}</p>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    <div class="page-break"></div>

    <!-- 5. Operational Plan -->
    @if($operationalPlans->isNotEmpty())
    <div class="section">
        <h2 class="section-title">5. RENCANA OPERASIONAL</h2>

        @foreach($operationalPlans as $plan)
        <div style="margin-bottom: 25px;">
            <h3 class="subsection-title">{{ $plan->operation_name }}</h3>

            @if($plan->description)
            <p style="text-align: justify; margin: 15px 0;">{{ $plan->description }}</p>
            @endif

            <div class="grid-2">
                <div class="grid-col">
                    @if($plan->location)
                    <p><strong>Lokasi:</strong> {{ $plan->location }}</p>
                    @endif
                    @if($plan->required_resources)
                    <p><strong>Sumber Daya:</strong> {{ $plan->required_resources }}</p>
                    @endif
                </div>
                <div class="grid-col">
                    @if($plan->timeline)
                    <p><strong>Timeline:</strong> {{ $plan->timeline }}</p>
                    @endif
                    @if($plan->responsible_person)
                    <p><strong>Penanggung Jawab:</strong> {{ $plan->responsible_person }}</p>
                    @endif
                </div>
            </div>

            @if($plan->expected_outcome)
            <div class="card">
                <h3>Target Hasil</h3>
                <p>{{ $plan->expected_outcome }}</p>
            </div>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    <div class="page-break"></div>

    <!-- 6. Team Structure -->
    @if($teamStructures->isNotEmpty())
    <div class="section">
        <h2 class="section-title">6. STRUKTUR TIM</h2>

        @foreach($teamStructures as $member)
        <div class="team-card clearfix">
            @if(isset($member->photo_base64))
                <img src="{{ $member->photo_base64 }}" alt="{{ $member->name }}" class="team-photo">
            @endif

            <h4>{{ $member->name }}</h4>
            <p class="position">{{ $member->position }}</p>

            @if($member->qualifications)
            <p><strong>Kualifikasi:</strong> {{ $member->qualifications }}</p>
            @endif

            @if($member->experience)
            <p><strong>Pengalaman:</strong> {{ $member->experience }}</p>
            @endif

            @if($member->responsibilities)
            <p><strong>Tanggung Jawab:</strong></p>
            <p>{{ $member->responsibilities }}</p>
            @endif

            @if($member->contact)
            <p><strong>Kontak:</strong> {{ $member->contact }}</p>
            @endif
        </div>
        @endforeach
    </div>
    @endif

    <div class="page-break"></div>

    <!-- 7. Financial Plan -->
    @if($financialPlans->isNotEmpty())
    <div class="section">
        <h2 class="section-title">7. RENCANA KEUANGAN</h2>

        <table>
            <thead>
                <tr>
                    <th>Periode</th>
                    <th>Pendapatan</th>
                    <th>Pengeluaran</th>
                    <th>Laba/Rugi</th>
                </tr>
            </thead>
            <tbody>
                @foreach($financialPlans as $plan)
                <tr>
                    <td><strong>{{ $plan->period }}</strong></td>
                    <td>Rp {{ number_format($plan->revenue, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($plan->expenses, 0, ',', '.') }}</td>
                    <td style="color: {{ ($plan->revenue - $plan->expenses) >= 0 ? '#16a34a' : '#dc2626' }}; font-weight: bold;">
                        Rp {{ number_format($plan->revenue - $plan->expenses, 0, ',', '.') }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @php
            $totalRevenue = $financialPlans->sum('revenue');
            $totalExpenses = $financialPlans->sum('expenses');
            $totalProfit = $totalRevenue - $totalExpenses;
        @endphp

        <div class="info-box" style="margin-top: 20px;">
            <h3>Ringkasan Keuangan</h3>
            <table style="border: none;">
                <tr>
                    <td style="border: none; width: 50%;"><strong>Total Pendapatan:</strong></td>
                    <td style="border: none; text-align: right;">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: none;"><strong>Total Pengeluaran:</strong></td>
                    <td style="border: none; text-align: right;">Rp {{ number_format($totalExpenses, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td style="border: none;"><strong>Total Laba/Rugi:</strong></td>
                    <td style="border: none; text-align: right; color: {{ $totalProfit >= 0 ? '#16a34a' : '#dc2626' }}; font-weight: bold;">
                        Rp {{ number_format($totalProfit, 0, ',', '.') }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>{{ $businessBackground->name }} - Business Plan</p>
        <p>Dibuat dengan SmartPlan {{ $isPro ? 'Pro' : 'Free' }} | {{ $generatedAt }}</p>
    </div>
</body>
</html>
