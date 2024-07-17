// ページコンテンツ
const pages = {
    start: `
        <div class="card">
            <h3>未成年証券口座を開設しよう</h3>
            <p>お申し込みは最短3分で完了します</p>
            <input type="checkbox">お客様情報の入力<br>
            <input type="checkbox">出金先口座の登録<br>
            <input type="checkbox">確認書類の登録<br>
            <input type="checkbox">事前交付書類等の確認<br>
            <br>
            <button onclick="showHome()" class="action-button">口座開設を完了</button>
        </div>
    `,
    home: `
        <div class="card">
            <h2>総資産</h2>
            <div class="balance">¥1,485,606</div>
            <div class="investment-summary">
                <div class="investment-item">
                    <div class="investment-value">¥143,609</div>
                    <div class="investment-label">前日比</div>
                </div>
                <div class="investment-item">
                    <div class="investment-value" style="color: #34A853;">+10.70%</div>
                    <div class="investment-label">収益率</div>
                </div>
            </div>
            <div class="chart-container">
                <canvas id="assetChart"></canvas>
            </div>
            <div class="action-buttons">
                <button class="action-button" onclick="showModal('deposit')">入金</button>
                <button class="action-button" onclick="showModal('autoInvest')">積立設定</button>
            </div>
        </div>
        <div class="card">
            <h2>最新のお知らせ</h2>
            <div id="newsList"></div>
        </div>
    `,
    invest: `
        <div class="card">
            <h2>つみたて投資 運用状況</h2>
            <div class="chart-container">
                <canvas id="investmentChart"></canvas>
            </div>
            <div class="action-buttons">
                <button class="action-button" onclick="showModal('changePlan')">運用プラン変更</button>
                <button class="action-button" onclick="showModal('changeAmount')">積立額変更</button>
            </div>
        </div>
    `,
    insurance: `
        <div class="card">
            <h2>学資保険シミュレーター</h2>
            <form id="insuranceForm">
                <select name="childAge" required>
                    <option value="">お子様の年齢</option>
                    <option value="0">0歳</option>
                    <option value="5">5歳</option>
                    <option value="10">10歳</option>
                </select>
                <select name="educationPlan" required>
                    <option value="">教育プラン</option>
                    <option value="public">公立</option>
                    <option value="private">私立</option>
                </select>
                <input type="number" name="monthlyBudget" placeholder="月々の積立金額" required>
                <button type="submit" class="action-button">シミュレーション実行</button>
            </form>
            <div id="simulationResult"></div>
        </div>
    `,
    settings: `
        <div class="card">
            <h2>設定</h2>
            <ul class="settings-list">
                <li>アカウント情報</li>
                <li>通知設定</li>
                <li>セキュリティ</li>
                <li>ヘルプ＆サポート</li>
                <li>ログアウト</li>
            </ul>
        </div>
    `
};

// ページ表示関数
function showPage(pageId) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = pages[pageId];
    
    if (pageId === 'home') {
        renderAssetChart();
        showNews();
    } else if (pageId === 'invest') {
        renderInvestmentChart();
    }
}

// 初期表示
showPage('start');

// ナビゲーションボタンのイベントリスナー
document.querySelectorAll('nav button').forEach(button => {
    button.addEventListener('click', () => showPage(button.id.replace('-btn', '')));
});

// ホーム画面の資産円グラフ
function renderAssetChart() {
    const ctx = document.getElementById('assetChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['学資保険', '株式', '債券', '現金'],
            datasets: [{
                data: [30, 40, 8, 22],
                backgroundColor: [
                    'rgba(230, 94, 106, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ],
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// 積立運用の推移線グラフ
function renderInvestmentChart() {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '積立金額',
                data: [400000, 900000, 770000, 1300000, 1400000, 1705606],
                borderColor: 'rgba(230, 94, 106, 0.8)',
                backgroundColor: 'rgba(230, 94, 106, 0.1)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 学資保険シミュレーター
document.addEventListener('submit', function(e) {
    if (e.target.id === 'insuranceForm') {
        e.preventDefault();
        const formData = new FormData(e.target);
        const childAge = parseInt(formData.get('childAge'));
        const educationPlan = formData.get('educationPlan');
        const monthlyBudget = parseInt(formData.get('monthlyBudget'));

        const yearsUntil18 = 18 - childAge;
        const totalSavings = monthlyBudget * 12 * yearsUntil18;
        const estimatedEducationCost = educationPlan === 'private' ? 20000000 : 10000000;
        const coverage = (totalSavings / estimatedEducationCost) * 100;

        const result = `
            <br>
            <h3>結果レポート</h3>
            <p>お子様の年齢: ${childAge}歳</p>
            <p>教育プラン: ${educationPlan === 'public' ? '公立' : '私立'}</p>
            <p>月々の積立金額: ¥${monthlyBudget.toLocaleString()}</p>
            <p>18歳までの総積立額: ¥${totalSavings.toLocaleString()}</p>
            <p>推定教育費: ¥${estimatedEducationCost.toLocaleString()}</p>
            <p>カバー率: ${coverage.toFixed(1)}%</p>
            <p>推奨プラン: ${coverage < 80 ? '積立額の増額をおすすめします' : 'このままのペースで順調です'}</p>
        `;
        document.getElementById('simulationResult').innerHTML = result;
    }
});

function showHome() {
    showPage('home');
}

function showNews() {
    const news = [
        '<a href="https://monewell.studio.site/seminar" target="_blank">資産運用セミナーを公開</a>',
        "新しい投資信託が追加されました",
        "年末のボーナス投資キャンペーン開催中",
        "口座開設で1,000円プレゼント中"
    ];
    const newsList = document.getElementById('newsList');
    newsList.innerHTML = '';
    news.forEach(item => {
        const li = document.createElement('div');
        li.className = 'notification-item';
        li.innerHTML = item; // innerHTMLを使用してリンクを正しく解釈させる
        newsList.appendChild(li);
    });
}



function showModal(type) {
    alert(`本アプリはデモ画面です。操作することができません。`);
}

// アプリ起動時の処理
window.onload = function() {
    showPage('start');
};