<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Article Content & Headline')
                ->description('Main article titles, category and rich content body')
                ->schema([
                    TextInput::make('title')
                        ->label('Article Headline (English)')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(function ($state, $set, $operation) {
                            if ($operation === 'create') {
                                $set('slug', Str::slug($state));
                            }
                        })
                        ->columnSpan(2),

                    TextInput::make('bangla_title')
                        ->label('বাংলা শিরোনাম (Optional Bangla Title)')
                        ->maxLength(255)
                        ->columnSpan(2),

                    TextInput::make('slug')
                        ->label('Article URL Slug')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->helperText('Public link: /blog/your-slug-here')
                        ->columnSpan(2),

                    Select::make('category')
                        ->label('Category')
                        ->options([
                            'Kids Room' => 'Kids Room',
                            'Kitchen Furniture' => 'Kitchen Furniture',
                            'Storage & Shelves' => 'Storage & Shelves',
                            'Bedroom Design' => 'Bedroom Design',
                            'Office Furniture' => 'Office Furniture',
                            'Living Room' => 'Living Room',
                            'Interior Trends' => 'Interior Trends',
                            'Care & Maintenance' => 'Care & Maintenance',
                        ])
                        ->searchable()
                        ->default('Interior Trends')
                        ->required(),

                    TextInput::make('read_time')
                        ->label('Estimated Read Time')
                        ->default('5 min read')
                        ->placeholder('e.g. 4 min read'),

                    Textarea::make('excerpt')
                        ->label('Short Summary / Excerpt')
                        ->helperText('Displayed on the blog card preview on the homepage and blog listing.')
                        ->rows(3)
                        ->required()
                        ->columnSpanFull(),

                    RichEditor::make('content')
                        ->label('Full Article Body')
                        ->helperText('Write your complete story with headings, bullet points, formatting and styling.')
                        ->columnSpanFull(),
                ])->columns(2),

            Section::make('Cover Image & Author Profile')
                ->description('Cover photography and writer attribution')
                ->schema([
                    FileUpload::make('image')
                        ->label('Featured Cover Image')
                        ->image()
                        ->directory('articles')
                        ->visibility('public')
                        ->imagePreviewHeight('80')
                        ->helperText('High quality landscape image (1200x630 recommended).')
                        ->columnSpan(2),

                    TextInput::make('author_name')
                        ->label('Author Name')
                        ->default('Look Studio Design Team')
                        ->required(),

                    TextInput::make('author_role')
                        ->label('Author Designation / Role')
                        ->default('Senior Interior Architect')
                        ->placeholder('e.g. Space Planning Architect'),

                    FileUpload::make('author_avatar')
                        ->label('Author Avatar Photo')
                        ->image()
                        ->directory('authors')
                        ->visibility('public')
                        ->avatar()
                        ->helperText('Square portrait photo for the writer card.')
                        ->columnSpan(2),
                ])->columns(2),

            Section::make('Publishing & SEO Metadata')
                ->description('Control live visibility and Google search settings')
                ->schema([
                    Toggle::make('is_published')
                        ->label('Published (Live on Website)')
                        ->default(true),

                    Toggle::make('is_featured')
                        ->label('Featured in Spotlight / Latest Insights')
                        ->helperText('Featured articles are highlighted at the top of the blog and on the homepage.')
                        ->default(false),

                    DateTimePicker::make('published_at')
                        ->label('Publish Date')
                        ->default(now()),

                    TextInput::make('meta_title')
                        ->label('Meta Title (SEO)')
                        ->maxLength(100)
                        ->columnSpan(2),

                    Textarea::make('meta_description')
                        ->label('Meta Description (SEO)')
                        ->maxLength(250)
                        ->rows(2)
                        ->columnSpan(2),
                ])->columns(2),
        ]);
    }
}
