<?php 
namespace App\Helpers\Api;

use Google\Cloud\Language\V1\Client\LanguageServiceClient;
use Google\Cloud\Language\V1\AnalyzeSentimentRequest;
use Google\Cloud\Language\V1\Document;
use Google\Cloud\Language\V1\Document\Type;

class GoogleNLPService
{
    protected $language;

    public function __construct()
    {
        $this->language = new LanguageServiceClient([
            'credentials' => base_path('storage/keys/google-key.json')
        ]);
    }

    public function analyzeSentiment(string $text): array
    {
        $document = (new Document())
        ->setContent($text)
        ->setType(Type::PLAIN_TEXT);

        $request = (new AnalyzeSentimentRequest())->setDocument($document);

        $response = $this->language->analyzeSentiment($request);

        $sentiment = $response->getDocumentSentiment();

        return [
            'sentiment' => $this->mapScoreToLabel($sentiment->getScore()),
            'score' => $sentiment->getScore(),
            'magnitude'=>$sentiment->getMagnitude()
        ];
    }

    private function mapScoreToLabel($score): string
    {
        return match (true) {
            $score > 0.25 => 'positive',
            $score < -0.25 => 'negative',
            default => 'neutral',
        };
    }
}
