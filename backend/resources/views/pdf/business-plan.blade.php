<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Business Plan - {{ $data['business_background']->name }}</title>
    <style>
        /* Reset dan base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Times New Roman", Times, serif;
            line-height: 1.5;
            color: #000;
            font-size: 12pt;
            text-align: justify;
        }

        /* Watermark untuk mode gratis */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72pt;
            color: rgba(0, 0, 0, 0.08);
            z-index: -1;
            white-space: nowrap;
            font-weight: bold;
            font-family: "Times New Roman", Times, serif;
        }

        /* Layout halaman */
        .page {
            page-break-after: always;
            padding: 25mm;
            position: relative;
            counter-increment: page;
        }

        .page:last-child {
            page-break-after: auto;
        }

        /* Header */
        .header {
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 8pt;
            margin-bottom: 16pt;
        }

        .company-name {
            font-size: 18pt;
            color: #2c5aa0;
            font-weight: bold;
            text-align: center;
            margin-bottom: 4pt;
        }

        .document-title {
            font-size: 14pt;
            color: #333;
            text-align: center;
            font-weight: bold;
        }

        /* Sections */
        .section {
            margin-bottom: 20pt;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 14pt;
            color: #2c5aa0;
            border-bottom: 1px solid #2c5aa0;
            padding-bottom: 4pt;
            margin-bottom: 8pt;
            font-weight: bold;
            text-align: left;
        }

        .subsection {
            margin-bottom: 12pt;
        }

        .subsection-title {
            font-size: 12pt;
            color: #000;
            font-weight: bold;
            margin-bottom: 6pt;
            text-decoration: underline;
        }

        /* Tables */
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 8pt 0;
            font-size: 10pt;
        }

        .table th,
        .table td {
            border: 1px solid #000;
            padding: 6pt;
            text-align: left;
            vertical-align: top;
        }

        .table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }

        .table tr:nth-child(even) {
            background-color: #f8f8f8;
        }

        /* Chart Tables */
        .chart-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12pt 0;
            font-size: 9pt;
        }

        .chart-table th {
            background-color: #2c5aa0;
            color: white;
            padding: 5pt;
            text-align: center;
            font-weight: bold;
            border: 1px solid #000;
        }

        .chart-table td {
            border: 1px solid #000;
            padding: 5pt;
            vertical-align: top;
        }

        .chart-table tr.total-row {
            background-color: #e8f4fd;
            font-weight: bold;
        }

        .chart-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        /* Chart Images */
        .chart-image {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 10pt 0;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        .chart-section {
            page-break-inside: avoid;
            margin: 16pt 0;
        }

        .chart-title {
            font-size: 11pt;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 8pt;
            text-align: center;
            background: #f8f9fa;
            padding: 6pt;
            border-radius: 4px;
            border-left: 4px solid #2c5aa0;
        }

        /* Utilities */
        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .text-bold {
            font-weight: bold;
        }

        .text-italic {
            font-style: italic;
        }

        .mb-10 {
            margin-bottom: 10pt;
        }

        .mb-15 {
            margin-bottom: 15pt;
        }

        .mt-15 {
            margin-top: 15pt;
        }

        /* Financial highlights */
        .financial-highlights {
            background: #f8f9fa;
            padding: 12pt;
            border-radius: 4px;
            border-left: 4px solid #2c5aa0;
            margin: 10pt 0;
        }

        .chart-container {
            background: #f8f9fa;
            padding: 12pt;
            border-radius: 4px;
            border: 1px solid #ddd;
            margin: 8pt 0;
        }

        /* List styles */
        .content-list {
            list-style-type: decimal;
            margin-left: 20pt;
            margin-bottom: 12pt;
        }

        .content-list li {
            margin-bottom: 6pt;
            line-height: 1.4;
        }

        .content-list .sub-list {
            list-style-type: lower-alpha;
            margin-left: 20pt;
            margin-top: 4pt;
        }

        .content-list .sub-list li {
            margin-bottom: 4pt;
        }

        /* Table of Contents */
        .toc-container {
            margin: 16pt 0;
        }

        .toc-item {
            margin-bottom: 4pt;
            line-height: 1.4;
        }

        .toc-page {
            float: right;
            font-weight: bold;
        }

        .toc-subitem {
            margin-left: 15pt;
            margin-bottom: 3pt;
            font-size: 11pt;
        }

        .toc-section {
            margin-bottom: 8pt;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: 15mm;
            left: 25mm;
            right: 25mm;
            border-top: 1px solid #000;
            padding-top: 6pt;
            font-size: 9pt;
            color: #666;
            text-align: center;
        }

        /* Page numbers */
        .page-number:before {
            content: "Halaman " counter(page);
        }

        /* Cover page styles */
        .cover-page {
            text-align: center;
            padding-top: 80pt;
        }

        .cover-title {
            font-size: 24pt;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 16pt;
            text-transform: uppercase;
        }

        .cover-subtitle {
            font-size: 18pt;
            color: #333;
            margin-bottom: 40pt;
            font-weight: bold;
        }

        .cover-info {
            font-size: 12pt;
            color: #666;
            margin-top: 60pt;
        }

        .cover-footer {
            position: absolute;
            bottom: 25mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }

        /* Executive summary */
        .executive-summary {
            line-height: 1.6;
            text-align: justify;
        }

        /* Signature section */
        .signature-section {
            margin-top: 40pt;
            text-align: center;
        }

        .signature-line {
            width: 200pt;
            border-bottom: 1px solid #000;
            margin: 20pt auto 8pt auto;
        }

        .signature-name {
            font-weight: bold;
            margin-bottom: 4pt;
        }

        .signature-title {
            font-size: 10pt;
            color: #666;
        }
    </style>
</head>
<body>
    @if ($mode === 'free')
        <div class="watermark">SMARTPLAN - VERSI GRATIS</div>
    @endif

    <!-- Cover Page -->
    <div class="page">
        <div class="cover-page">
            @if ($data['business_background']->logo)
                <div style="margin-bottom: 30pt;">
                    <img src="{{ $data['business_background']->logo }}" alt="Logo"
                        style="max-width: 120pt; max-height: 120pt;">
                </div>
            @endif

            <h1 class="cover-title">
                {{ $data['business_background']->name }}
            </h1>
            <h2 class="cover-subtitle">
                BUSINESS PLAN
            </h2>

            <div style="height: 80pt;"></div>

            <div class="cover-info">
                <p>Disusun pada: {{ $generated_at }}</p>
                <p>Oleh: {{ $data['business_background']->user->name ?? 'Tim Management' }}</p>
            </div>

            <div class="cover-footer">
                <p>Dokumen ini dibuat secara otomatis oleh SMARTPLAN-WEB System</p>
                <p>© {{ date('Y') }} SMARTPLAN. Hak Cipta Dilindungi.</p>
            </div>
        </div>
    </div>

    <!-- Table of Contents -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">DAFTAR ISI</div>
        </div>

        <div class="toc-container">
            <div class="toc-section">
                <div class="toc-item">
                    <span>1. RINGKASAN EKSEKUTIF</span>
                    <span class="toc-page">3</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>2. LATAR BELAKANG BISNIS</span>
                    <span class="toc-page">4</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>3. ANALISIS PASAR</span>
                    <span class="toc-page">5</span>
                </div>
                <div class="toc-subitem">
                    <span>3.1. Target Pasar</span>
                    <span class="toc-page">5</span>
                </div>
                <div class="toc-subitem">
                    <span>3.2. Analisis Kompetitor</span>
                    <span class="toc-page">5</span>
                </div>
                <div class="toc-subitem">
                    <span>3.3. Analisis SWOT</span>
                    <span class="toc-page">6</span>
                </div>
                <div class="toc-subitem">
                    <span>3.4. Ukuran Pasar</span>
                    <span class="toc-page">6</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>4. PRODUK & LAYANAN</span>
                    <span class="toc-page">7</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>5. STRATEGI PEMASARAN</span>
                    <span class="toc-page">8</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>6. RENCANA OPERASIONAL</span>
                    <span class="toc-page">9</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>7. STRUKTUR TIM</span>
                    <span class="toc-page">10</span>
                </div>
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>8. RENCANA KEUANGAN</span>
                    <span class="toc-page">11</span>
                </div>
                @foreach ($data['financial_plans'] as $index => $financial)
                <div class="toc-subitem">
                    <span>8.{{ $index + 1 }}. {{ $financial->plan_name }}</span>
                    <span class="toc-page">11</span>
                </div>
                <div class="toc-subitem">
                    <span>8.{{ $index + 1 }}.1. Ringkasan Keuangan</span>
                    <span class="toc-page">11</span>
                </div>
                <div class="toc-subitem">
                    <span>8.{{ $index + 1 }}.2. Analisis Profit & Loss</span>
                    <span class="toc-page">12</span>
                </div>
                <div class="toc-subitem">
                    <span>8.{{ $index + 1 }}.3. Struktur Modal</span>
                    <span class="toc-page">13</span>
                </div>
                <div class="toc-subitem">
                    <span>8.{{ $index + 1 }}.4. Sumber Pendapatan</span>
                    <span class="toc-page">14</span>
                </div>
                <div class="toc-subitem">
                    <span>8.{{ $index + 1 }}.5. Grafik Keuangan</span>
                    <span class="toc-page">15</span>
                </div>
                @endforeach
            </div>

            <div class="toc-section">
                <div class="toc-item">
                    <span>LAMPIRAN</span>
                    <span class="toc-page">16</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Executive Summary -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">1. RINGKASAN EKSEKUTIF</div>
        </div>

        <div class="section">
            <div class="executive-summary">
                {!! nl2br(e($executiveSummary)) !!}
            </div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
            <div style="margin-bottom: 20pt;">
                <p>Dibuat dengan penuh pertimbangan dan analisis mendalam,</p>
            </div>

            <div style="margin-top: 40pt;">
                <div class="signature-line"></div>
                <div class="signature-name">{{ $data['business_background']->user->name ?? 'Management' }}</div>
                <div class="signature-title">Direktur Utama</div>
            </div>
        </div>
    </div>

    <!-- Business Background -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">2. LATAR BELAKANG BISNIS</div>
        </div>

        <div class="section">
            <div class="subsection">
                <div class="subsection-title">Informasi Umum Perusahaan</div>
                <table class="table">
                    <tr>
                        <td style="width: 30%;"><strong>Nama Bisnis</strong></td>
                        <td>{{ $data['business_background']->name }}</td>
                    </tr>
                    <tr>
                        <td><strong>Kategori Bisnis</strong></td>
                        <td>{{ $data['business_background']->category }}</td>
                    </tr>
                    <tr>
                        <td><strong>Lokasi Operasional</strong></td>
                        <td>{{ $data['business_background']->location }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tipe Bisnis</strong></td>
                        <td>{{ $data['business_background']->business_type }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tanggal Mulai Operasi</strong></td>
                        <td>{{ $data['business_background']->start_date ? date('d F Y', strtotime($data['business_background']->start_date)) : 'Belum Ditentukan' }}</td>
                    </tr>
                </table>
            </div>

            <div class="subsection">
                <div class="subsection-title">Deskripsi Bisnis</div>
                <p>{!! nl2br(e($data['business_background']->description)) !!}</p>
            </div>

            @if ($data['business_background']->purpose)
            <div class="subsection">
                <div class="subsection-title">Tujuan Bisnis</div>
                <p>{!! nl2br(e($data['business_background']->purpose)) !!}</p>
            </div>
            @endif

            @if ($data['business_background']->vision)
            <div class="subsection">
                <div class="subsection-title">Visi Perusahaan</div>
                <p class="text-italic">{!! nl2br(e($data['business_background']->vision)) !!}</p>
            </div>
            @endif

            @if ($data['business_background']->mission)
            <div class="subsection">
                <div class="subsection-title">Misi Perusahaan</div>
                <p>{!! nl2br(e($data['business_background']->mission)) !!}</p>
            </div>
            @endif

            @if ($data['business_background']->values)
            <div class="subsection">
                <div class="subsection-title">Nilai-Nilai Perusahaan</div>
                <p>{!! nl2br(e($data['business_background']->values)) !!}</p>
            </div>
            @endif
        </div>
    </div>

    <!-- Market Analysis -->
    @if ($data['market_analysis'])
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">3. ANALISIS PASAR</div>
        </div>

        <div class="section">
            @if ($data['market_analysis']->target_market)
            <div class="subsection">
                <div class="subsection-title">3.1. Target Pasar</div>
                <p>{!! nl2br(e($data['market_analysis']->target_market)) !!}</p>
            </div>
            @endif

            @if ($data['market_analysis']->market_size)
            <div class="subsection">
                <div class="subsection-title">3.2. Ukuran Pasar</div>
                <p>{!! nl2br(e($data['market_analysis']->market_size)) !!}</p>
            </div>
            @endif

            @if ($data['market_analysis']->market_trends)
            <div class="subsection">
                <div class="subsection-title">3.3. Tren Pasar</div>
                <p>{!! nl2br(e($data['market_analysis']->market_trends)) !!}</p>
            </div>
            @endif

            <!-- Market Size Metrics -->
            @if ($data['market_analysis']->tam_total)
            <div class="subsection">
                <div class="subsection-title">3.4. Analisis Ukuran Pasar</div>
                <table class="table">
                    <tr>
                        <th style="width: 40%;">Metrik Pasar</th>
                        <th style="width: 30%;">Nilai (Rp)</th>
                        <th style="width: 30%;">Keterangan</th>
                    </tr>
                    <tr>
                        <td><strong>Total Addressable Market (TAM)</strong></td>
                        <td>Rp {{ number_format($data['market_analysis']->tam_total, 0, ',', '.') }}</td>
                        <td>Total pasar yang tersedia</td>
                    </tr>
                    <tr>
                        <td><strong>Serviceable Available Market (SAM)</strong></td>
                        <td>Rp {{ number_format($data['market_analysis']->sam_total, 0, ',', '.') }}</td>
                        <td>Pasar yang dapat dilayani ({{ $data['market_analysis']->sam_percentage }}% dari TAM)</td>
                    </tr>
                    <tr>
                        <td><strong>Serviceable Obtainable Market (SOM)</strong></td>
                        <td>Rp {{ number_format($data['market_analysis']->som_total, 0, ',', '.') }}</td>
                        <td>Pasar yang dapat diraih ({{ $data['market_analysis']->som_percentage }}% dari SAM)</td>
                    </tr>
                </table>
            </div>
            @endif

            <!-- Competitors -->
            @if ($data['market_analysis']->competitors->count() > 0)
            <div class="subsection">
                <div class="subsection-title">3.5. Analisis Kompetitor</div>
                <table class="table">
                    <tr>
                        <th>Nama Kompetitor</th>
                        <th>Tipe</th>
                        <th>Perkiraan Penjualan Tahunan</th>
                        <th>Harga Rata-rata</th>
                        <th>Kekuatan</th>
                        <th>Kelemahan</th>
                    </tr>
                    @foreach ($data['market_analysis']->competitors as $competitor)
                    <tr>
                        <td>{{ $competitor->competitor_name }}</td>
                        <td>{{ $competitor->type_label }}</td>
                        <td>
                            @if ($competitor->annual_sales_estimate)
                                Rp {{ number_format($competitor->annual_sales_estimate, 0, ',', '.') }}
                            @else
                                -
                            @endif
                        </td>
                        <td>
                            @if ($competitor->selling_price)
                                Rp {{ number_format($competitor->selling_price, 0, ',', '.') }}
                            @else
                                -
                            @endif
                        </td>
                        <td>{{ $competitor->strengths ? substr($competitor->strengths, 0, 50) . (strlen($competitor->strengths) > 50 ? '...' : '') : '-' }}</td>
                        <td>{{ $competitor->weaknesses ? substr($competitor->weaknesses, 0, 50) . (strlen($competitor->weaknesses) > 50 ? '...' : '') : '-' }}</td>
                    </tr>
                    @endforeach
                </table>
            </div>
            @endif

            <!-- SWOT Analysis -->
            @if ($data['market_analysis']->strengths || $data['market_analysis']->weaknesses || $data['market_analysis']->opportunities || $data['market_analysis']->threats)
            <div class="subsection">
                <div class="subsection-title">3.6. Analisis SWOT</div>
                <table class="table">
                    <tr>
                        <th style="width: 25%;">Strengths (Kekuatan)</th>
                        <th style="width: 25%;">Weaknesses (Kelemahan)</th>
                        <th style="width: 25%;">Opportunities (Peluang)</th>
                        <th style="width: 25%;">Threats (Ancaman)</th>
                    </tr>
                    <tr>
                        <td>{!! nl2br(e($data['market_analysis']->strengths ?: '-')) !!}</td>
                        <td>{!! nl2br(e($data['market_analysis']->weaknesses ?: '-')) !!}</td>
                        <td>{!! nl2br(e($data['market_analysis']->opportunities ?: '-')) !!}</td>
                        <td>{!! nl2br(e($data['market_analysis']->threats ?: '-')) !!}</td>
                    </tr>
                </table>
            </div>
            @endif

            @if ($data['market_analysis']->competitive_advantage)
            <div class="subsection">
                <div class="subsection-title">3.7. Keunggulan Kompetitif</div>
                <p>{!! nl2br(e($data['market_analysis']->competitive_advantage)) !!}</p>
            </div>
            @endif
        </div>
    </div>
    @endif

    <!-- Products & Services -->
    @if ($data['products_services']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">4. PRODUK & LAYANAN</div>
        </div>

        <div class="section">
            @foreach ($data['products_services'] as $index => $product)
            <div class="subsection" style="page-break-inside: avoid;">
                <div class="subsection-title">
                    {{ $index + 1 }}. {{ $product->name }} ({{ $product->type === 'product' ? 'Produk' : 'Layanan' }})
                </div>

                <table class="table">
                    <tr>
                        <td style="width: 20%;"><strong>Deskripsi</strong></td>
                        <td>{!! nl2br(e($product->description)) !!}</td>
                    </tr>
                    @if ($product->price)
                    <tr>
                        <td><strong>Harga</strong></td>
                        <td>Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                    </tr>
                    @endif
                    @if ($product->advantages)
                    <tr>
                        <td><strong>Keunggulan</strong></td>
                        <td>{!! nl2br(e($product->advantages)) !!}</td>
                    </tr>
                    @endif
                    @if ($product->development_strategy)
                    <tr>
                        <td><strong>Strategi Pengembangan</strong></td>
                        <td>{!! nl2br(e($product->development_strategy)) !!}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Status</strong></td>
                        <td>
                            @if ($product->status === 'draft')
                                <span class="text-italic">Dalam Perencanaan</span>
                            @elseif($product->status === 'in_development')
                                <span class="text-italic">Dalam Pengembangan</span>
                            @else
                                <span class="text-bold">Sudah Diluncurkan</span>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Marketing Strategies -->
    @if ($data['marketing_strategies']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">5. STRATEGI PEMASARAN</div>
        </div>

        <div class="section">
            @foreach ($data['marketing_strategies'] as $index => $strategy)
            <div class="subsection">
                <div class="subsection-title">Strategi {{ $index + 1 }}</div>
                <table class="table">
                    <tr>
                        <td style="width: 20%;"><strong>Strategi Promosi</strong></td>
                        <td>{!! nl2br(e($strategy->promotion_strategy)) !!}</td>
                    </tr>
                    @if ($strategy->media_used)
                    <tr>
                        <td><strong>Media yang Digunakan</strong></td>
                        <td>{!! nl2br(e($strategy->media_used)) !!}</td>
                    </tr>
                    @endif
                    @if ($strategy->pricing_strategy)
                    <tr>
                        <td><strong>Strategi Harga</strong></td>
                        <td>{!! nl2br(e($strategy->pricing_strategy)) !!}</td>
                    </tr>
                    @endif
                    @if ($strategy->monthly_target)
                    <tr>
                        <td><strong>Target Bulanan</strong></td>
                        <td>{{ number_format($strategy->monthly_target, 0, ',', '.') }} unit/transaksi</td>
                    </tr>
                    @endif
                    @if ($strategy->collaboration_plan)
                    <tr>
                        <td><strong>Rencana Kolaborasi</strong></td>
                        <td>{!! nl2br(e($strategy->collaboration_plan)) !!}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Status Implementasi</strong></td>
                        <td>
                            @if ($strategy->status === 'draft')
                                <span class="text-italic">Rencana</span>
                            @else
                                <span class="text-bold">Sedang Berjalan</span>
                            @endif
                        </td>
                    </tr>
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Operational Plans -->
    @if ($data['operational_plans']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">6. RENCANA OPERASIONAL</div>
        </div>

        <div class="section">
            @foreach ($data['operational_plans'] as $index => $plan)
            <div class="subsection">
                <div class="subsection-title">Rencana Operasional {{ $index + 1 }}</div>
                <table class="table">
                    <tr>
                        <td style="width: 20%;"><strong>Lokasi Bisnis</strong></td>
                        <td>{{ $plan->business_location }}</td>
                    </tr>
                    @if ($plan->location_description)
                    <tr>
                        <td><strong>Deskripsi Lokasi</strong></td>
                        <td>{!! nl2br(e($plan->location_description)) !!}</td>
                    </tr>
                    @endif
                    <tr>
                        <td><strong>Tipe Lokasi</strong></td>
                        <td>{{ $plan->location_type }}</td>
                    </tr>
                    @if ($plan->location_size)
                    <tr>
                        <td><strong>Ukuran Lokasi</strong></td>
                        <td>{{ number_format($plan->location_size, 0, ',', '.') }} m²</td>
                    </tr>
                    @endif
                    @if ($plan->rent_cost)
                    <tr>
                        <td><strong>Biaya Sewa</strong></td>
                        <td>Rp {{ number_format($plan->rent_cost, 0, ',', '.') }}/bulan</td>
                    </tr>
                    @endif
                    @if ($plan->daily_workflow)
                    <tr>
                        <td><strong>Alur Kerja Harian</strong></td>
                        <td>{!! nl2br(e($plan->daily_workflow)) !!}</td>
                    </tr>
                    @endif
                    @if ($plan->equipment_needs)
                    <tr>
                        <td><strong>Kebutuhan Peralatan</strong></td>
                        <td>{!! nl2br(e($plan->equipment_needs)) !!}</td>
                    </tr>
                    @endif
                    @if ($plan->technology_stack)
                    <tr>
                        <td><strong>Teknologi yang Digunakan</strong></td>
                        <td>{!! nl2br(e($plan->technology_stack)) !!}</td>
                    </tr>
                    @endif
                </table>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <!-- Team Structure -->
    @if ($data['team_structures']->count() > 0)
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">7. STRUKTUR TIM</div>
        </div>

        <div class="section">
            <table class="table">
                <tr>
                    <th>Kategori Tim</th>
                    <th>Nama Anggota</th>
                    <th>Posisi/Jabatan</th>
                    <th>Pengalaman & Kualifikasi</th>
                </tr>
                @foreach ($data['team_structures'] as $member)
                <tr>
                    <td>{{ $member->team_category }}</td>
                    <td>{{ $member->member_name }}</td>
                    <td>{{ $member->position }}</td>
                    <td>{!! nl2br(e($member->experience)) !!}</td>
                </tr>
                @endforeach
            </table>
        </div>
    </div>
    @endif

    <!-- Financial Plans -->
    @if ($data['financial_plans']->count() > 0)
        @foreach ($data['financial_plans'] as $index => $financial)
        <!-- Financial Plan Main Page -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">8. {{ $index + 1 }}. RENCANA KEUANGAN - {{ $financial->plan_name }}</div>
            </div>

            <div class="section">
                <div class="subsection">
                    <div class="subsection-title">{{ $financial->plan_name }}</div>

                    <!-- Financial Highlights -->
                    <div class="financial-highlights mb-15">
                        <div class="subsection-title">8.{{ $index + 1 }}.1. Ringkasan Keuangan</div>
                        <table class="table">
                            <tr>
                                <td><strong>ROI (Return on Investment)</strong></td>
                                <td>{{ $financial->roi_percentage }}%</td>
                                <td><strong>Payback Period</strong></td>
                                <td>{{ $financial->payback_period }} bulan</td>
                            </tr>
                            <tr>
                                <td><strong>Profit Margin</strong></td>
                                <td>{{ $financial->profit_margin }}%</td>
                                <td><strong>Status Kelayakan</strong></td>
                                <td>{{ $financial->feasibility_status }}</td>
                            </tr>
                            <tr>
                                <td><strong>Total Modal Awal</strong></td>
                                <td>Rp {{ number_format($financial->total_initial_capital, 0, ',', '.') }}</td>
                                <td><strong>Pendapatan Tahunan Proyeksi</strong></td>
                                <td>Rp {{ number_format($financial->total_yearly_income, 0, ',', '.') }}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Capital Sources -->
                    @if ($financial->capital_sources)
                    <div class="subsection">
                        <div class="subsection-title">8.{{ $index + 1 }}.2. Struktur Modal</div>
                        <table class="table">
                            <tr>
                                <th>Sumber Modal</th>
                                <th>Jumlah (Rp)</th>
                                <th>Persentase</th>
                            </tr>
                            @foreach ($financial->capital_sources as $source)
                            <tr>
                                <td>{{ $source['source'] }}</td>
                                <td>Rp {{ number_format($source['amount'], 0, ',', '.') }}</td>
                                <td>{{ $source['percentage'] }}%</td>
                            </tr>
                            @endforeach
                            <tr class="text-bold">
                                <td><strong>Total Modal Awal</strong></td>
                                <td colspan="2"><strong>Rp {{ number_format($financial->total_initial_capital, 0, ',', '.') }}</strong></td>
                            </tr>
                        </table>
                    </div>
                    @endif

                    <!-- Sales Projections -->
                    @if ($financial->sales_projections)
                    <div class="subsection">
                        <div class="subsection-title">8.{{ $index + 1 }}.3. Proyeksi Penjualan</div>
                        <table class="table">
                            <tr>
                                <th>Produk/Layanan</th>
                                <th>Harga per Unit</th>
                                <th>Volume/Bulan</th>
                                <th>Pendapatan/Bulan</th>
                            </tr>
                            @foreach ($financial->sales_projections as $projection)
                            <tr>
                                <td>{{ $projection['product'] }}</td>
                                <td>Rp {{ number_format($projection['price'], 0, ',', '.') }}</td>
                                <td>{{ number_format($projection['volume'], 0, ',', '.') }} unit</td>
                                <td>Rp {{ number_format($projection['monthly_income'], 0, ',', '.') }}</td>
                            </tr>
                            @endforeach
                            <tr class="text-bold">
                                <td colspan="3"><strong>Total Pendapatan Bulanan</strong></td>
                                <td><strong>Rp {{ number_format($financial->total_monthly_income, 0, ',', '.') }}</strong></td>
                            </tr>
                            <tr class="text-bold">
                                <td colspan="3"><strong>Total Pendapatan Tahunan</strong></td>
                                <td><strong>Rp {{ number_format($financial->total_yearly_income, 0, ',', '.') }}</strong></td>
                            </tr>
                        </table>
                    </div>
                    @endif

                    <!-- Profit Loss Summary -->
                    <div class="subsection">
                        <div class="subsection-title">8.{{ $index + 1 }}.4. Ringkasan Laba Rugi (Bulanan)</div>
                        <table class="table">
                            <tr>
                                <td><strong>Pendapatan Bulanan</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->total_monthly_income, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Biaya Operasional Bulanan</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->total_monthly_opex, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Laba Kotor</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->gross_profit, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Pajak ({{ $financial->tax_rate }}%)</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->tax_amount, 0, ',', '.') }}</td>
                            </tr>
                            <tr>
                                <td><strong>Biaya Bunga</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->interest_expense, 0, ',', '.') }}</td>
                            </tr>
                            <tr class="text-bold">
                                <td><strong>Laba Bersih Bulanan</strong></td>
                                <td class="text-right">Rp {{ number_format($financial->net_profit, 0, ',', '.') }}</td>
                            </tr>
                        </table>
                    </div>

                    @if ($financial->feasibility_notes)
                    <div class="subsection">
                        <div class="subsection-title">8.{{ $index + 1 }}.5. Analisis Kelayakan</div>
                        <p>{!! nl2br(e($financial->feasibility_notes)) !!}</p>
                    </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Chart Data Pages -->
        @if (isset($chartData[$financial->id]))
        <!-- Profit & Loss Chart Data -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">ANALISIS PROFIT & LOSS - {{ $financial->plan_name }}</div>
            </div>

            <div class="section">
                <div class="chart-container">
                    <div class="chart-title">ANALISIS PROFIT & LOSS (Bulanan)</div>
                    <table class="chart-table">
                        @foreach ($chartData[$financial->id]['profit_loss'] as $rowIndex => $row)
                        <tr class="{{ $rowIndex === 0 ? '' : ($rowIndex === count($chartData[$financial->id]['profit_loss'])-1 ? 'total-row' : '') }}">
                            @foreach ($row as $cell)
                            <td>{{ $cell }}</td>
                            @endforeach
                        </tr>
                        @endforeach
                    </table>
                </div>

                <div class="chart-container">
                    <div class="chart-title">METRIK KEUANGAN UTAMA</div>
                    <table class="chart-table">
                        @foreach ($chartData[$financial->id]['financial_metrics'] as $rowIndex => $row)
                        <tr class="{{ $rowIndex === 0 ? '' : '' }}">
                            @foreach ($row as $cell)
                            <td>{{ $cell }}</td>
                            @endforeach
                        </tr>
                        @endforeach
                    </table>
                </div>
            </div>
        </div>

        <!-- Revenue Streams Chart Data -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">SUMBER PENDAPATAN - {{ $financial->plan_name }}</div>
            </div>

            <div class="section">
                <div class="chart-container">
                    <div class="chart-title">DETAIL SUMBER PENDAPATAN</div>
                    <table class="chart-table">
                        @foreach ($chartData[$financial->id]['revenue_streams'] as $rowIndex => $row)
                        <tr class="{{ $rowIndex === 0 ? '' : ($rowIndex === count($chartData[$financial->id]['revenue_streams'])-1 ? 'total-row' : '') }}">
                            @foreach ($row as $cell)
                            <td>{{ $cell }}</td>
                            @endforeach
                        </tr>
                        @endforeach
                    </table>
                </div>
            </div>
        </div>

        <!-- Capital Structure Chart Data -->
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">STRUKTUR MODAL - {{ $financial->plan_name }}</div>
            </div>

            <div class="section">
                <div class="chart-container">
                    <div class="chart-title">KOMPOSISI SUMBER MODAL</div>
                    <table class="chart-table">
                        @foreach ($chartData[$financial->id]['capital_structure'] as $rowIndex => $row)
                        <tr class="{{ $rowIndex === 0 ? '' : ($rowIndex === count($chartData[$financial->id]['capital_structure'])-1 ? 'total-row' : '') }}">
                            @foreach ($row as $cell)
                            <td>{{ $cell }}</td>
                            @endforeach
                        </tr>
                        @endforeach
                    </table>
                </div>
            </div>
        </div>
        @endif

        <!-- Chart Images Pages -->
        @if (isset($chartImages[$financial->id]))
        <div class="page">
            <div class="header">
                <div class="company-name">{{ $data['business_background']->name }}</div>
                <div class="document-title">GRAFIK KEUANGAN - {{ $financial->plan_name }}</div>
            </div>

            <div class="section">
                @if (isset($chartImages[$financial->id]['profit_loss']))
                <div class="chart-section">
                    <div class="chart-title">GRAFIK PROFIT & LOSS</div>
                    <img src="{{ $chartImages[$financial->id]['profit_loss'] }}"
                         class="chart-image"
                         alt="Profit Loss Chart">
                </div>
                @endif

                @if (isset($chartImages[$financial->id]['revenue_streams']))
                <div class="chart-section">
                    <div class="chart-title">GRAFIK SUMBER PENDAPATAN</div>
                    <img src="{{ $chartImages[$financial->id]['revenue_streams'] }}"
                         class="chart-image"
                         alt="Revenue Streams Chart">
                </div>
                @endif

                @if (isset($chartImages[$financial->id]['capital_structure']))
                <div class="chart-section">
                    <div class="chart-title">GRAFIK STRUKTUR MODAL</div>
                    <img src="{{ $chartImages[$financial->id]['capital_structure'] }}"
                         class="chart-image"
                         alt="Capital Structure Chart">
                </div>
                @endif
            </div>
        </div>
        @endif
        @endforeach
    @endif

    <!-- Appendix -->
    <div class="page">
        <div class="header">
            <div class="company-name">{{ $data['business_background']->name }}</div>
            <div class="document-title">LAMPIRAN</div>
        </div>

        <div class="section">
            <div class="subsection">
                <div class="subsection-title">Informasi Dokumen</div>
                <table class="table">
                    <tr>
                        <td style="width: 30%;"><strong>Nama Dokumen</strong></td>
                        <td>Business Plan - {{ $data['business_background']->name }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tanggal Generate</strong></td>
                        <td>{{ $generated_at }}</td>
                    </tr>
                    <tr>
                        <td><strong>Mode Dokumen</strong></td>
                        <td>{{ $mode === 'free' ? 'Versi Gratis' : 'Versi Professional' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Total Halaman</strong></td>
                        <td><span class="page-number"></span></td>
                    </tr>
                </table>
            </div>

            <div class="subsection">
                <div class="subsection-title">Kontak</div>
                <p>Untuk informasi lebih lanjut mengenai business plan ini, silakan hubungi:</p>
                <table class="table">
                    <tr>
                        <td style="width: 30%;"><strong>Nama Perusahaan</strong></td>
                        <td>{{ $data['business_background']->name }}</td>
                    </tr>
                    <tr>
                        <td><strong>Pemilik/Direktur</strong></td>
                        <td>{{ $data['business_background']->user->name ?? 'Tim Management' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Lokasi</strong></td>
                        <td>{{ $data['business_background']->location }}</td>
                    </tr>
                </table>
            </div>

            <div class="subsection">
                <div class="subsection-title">Pernyataan</div>
                <p class="text-italic">
                    Dokumen business plan ini disusun dengan sebaik-baiknya berdasarkan data dan informasi
                    yang tersedia pada saat penyusunan. Semua proyeksi dan perkiraan yang tercantum dalam
                    dokumen ini merupakan estimasi yang dapat berubah sesuai dengan kondisi pasar dan
                    perkembangan bisnis yang aktual.
                </p>
            </div>
        </div>
    </div>

    <!-- Footer untuk semua halaman -->
    <div class="footer">
        <div style="float: left;">
            {{ $data['business_background']->name }} - Business Plan
        </div>
        <div style="float: right;" class="page-number"></div>
        <div style="clear: both;"></div>
    </div>
</body>
</html>
