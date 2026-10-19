<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shop;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        Shop::create([
            'shop_name' => '目黒不動産',
            'review_elements' => ['ファミリー物件に対する知識', '〇〇大学周辺物件への知識', '目黒区エリアについての知識', '売買の知識', '接客態度', 'スピード感', '担当者の安心感'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '渋谷エステート',
            'review_elements' => ['若者向け物件の知識', '初期費用の安さ・相談', '渋谷・恵比寿エリアの詳しさ', 'レスポンスの速さ', '内見時の案内'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '新宿タワーハウジング',
            'review_elements' => ['タワーマンションに関する知識', '投資用物件の提案力', '新宿エリアの治安情報', '契約手続きのスムーズさ', '担当者の熱意'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '品川ホームズ',
            'review_elements' => ['単身赴任向け物件の知識', '品川・港区エリアの詳しさ', 'オンライン内見の対応', '重要事項説明のわかりやすさ', '店舗の雰囲気'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '世田谷リアルティ',
            'review_elements' => ['戸建て物件の提案力', '学区や子育て環境の知識', '世田谷区内のネットワーク', '駐車場の探しやすさ', '親身な接客'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '池袋お部屋探しセンター',
            'review_elements' => ['学生向けアパートの知識', '審査通過へのサポート', '池袋周辺のディープな情報', '連絡の取りやすさ', 'フットワークの軽さ'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '銀座プレミアム不動産',
            'review_elements' => ['高級賃貸の知識', 'プライバシーへの配慮', '銀座・中央区エリアの詳しさ', '接客の質の高さ', '送迎サービスの快適さ'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '中野ブロードウェイエステート',
            'review_elements' => ['サブカル層向け物件の知識', 'ペット可物件の提案力', '中野エリアの飲食店情報', '気さくな対応', '入居後のアフターフォロー'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '吉祥寺住まいの窓口',
            'review_elements' => ['ファミリー向け賃貸の知識', '井の頭公園周辺の詳しさ', '治安や生活環境の説明', '笑顔での接客', 'キッズスペースの充実度'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '恵比寿デザイン不動産',
            'review_elements' => ['デザイナーズ物件の知識', 'リノベーション物件の提案力', '恵比寿・代官山エリアの詳しさ', 'おしゃれな店舗の雰囲気', '的確なアドバイス'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '豊洲ベイエリアハウジング',
            'review_elements' => ['タワマンの眺望・設備の知識', '湾岸エリアの開発情報', 'ファミリー向け施設の案内', '丁寧なヒアリング', 'スピード対応'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '浅草下町エステート',
            'review_elements' => ['リノベ古民家の提案力', '浅草・台東区の歴史や風土の知識', '家賃交渉の頑張り', 'アットホームな接客', '地元密着の安心感'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '蒲田ローカルエステート',
            'review_elements' => ['羽田空港アクセスの知識', '蒲田周辺のディープな情報', '初期費用を抑える提案', 'フランクな接客', '夜遅くまでの対応'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '赤羽センタールーム',
            'review_elements' => ['飲み屋街周辺の環境知識', '一人暮らし向け物件の提案力', '埼玉・都内へのアクセス情報', '元気な挨拶', 'スピーディーな内見手配'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '錦糸町イーストホーム',
            'review_elements' => ['総武線沿線の物件知識', '治安に関する正直な説明', '錦糸町・墨田区エリアの詳しさ', '外国籍の方への対応力', '親切なサポート'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '立川ウエストリアルティ',
            'review_elements' => ['多摩地域の物件知識', '駐車場付き物件の提案力', '商業施設へのアクセス情報', '誠実な対応', '車での案内時の快適さ'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '町田キャンパスエステート',
            'review_elements' => ['近隣大学への通学しやすさ', '学生向けキャンペーンの充実', '町田エリアの治安情報', '親御さんへの丁寧な説明', 'LINEでの連絡のスムーズさ'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '六本木エグゼクティブ不動産',
            'review_elements' => ['タワーマンションの設備知識', '投資・節税アドバイス', '港区エリアのブランド知識', '完全個室での接客', '契約の正確さ'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '練馬ファミリーホーム',
            'review_elements' => ['子育て支援制度の知識', '公園やスーパーの充実度情報', '練馬区・板橋区エリアの詳しさ', '女性スタッフの対応', '子供への配慮'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);

        Shop::create([
            'shop_name' => '横浜みなとみらい不動産',
            'review_elements' => ['海が見える物件の提案力', '横浜・桜木町エリアの詳しさ', '通勤・通学アクセスの説明', 'さわやかな接客', '店舗の清潔感'],
            'google_review_url' => 'https://www.google.com/maps',
        ]);
    }
}