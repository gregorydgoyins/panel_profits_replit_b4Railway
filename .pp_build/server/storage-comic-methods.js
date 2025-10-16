"use strict";
// Comic methods to be added to MemStorage class
// This file contains the missing comic methods for the MemStorage implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.comicMethods = void 0;
exports.comicMethods = `
  // Comic Series management
  async getComicSeries(id: string): Promise<ComicSeries | undefined> {
    return this.comicSeries.get(id);
  }

  async getComicSeriesList(filters?: { publisher?: string; year?: number; search?: string; limit?: number }): Promise<ComicSeries[]> {
    let series = Array.from(this.comicSeries.values());
    
    if (filters?.publisher) {
      series = series.filter(s => s.publisher.toLowerCase().includes(filters.publisher!.toLowerCase()));
    }
    
    if (filters?.year) {
      series = series.filter(s => s.year === filters.year);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      series = series.filter(s => 
        s.seriesName.toLowerCase().includes(searchLower) ||
        s.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.limit) {
      series = series.slice(0, filters.limit);
    }
    
    return series;
  }

  async createComicSeries(insertSeries: InsertComicSeries): Promise<ComicSeries> {
    const id = randomUUID();
    const series: ComicSeries = {
      ...insertSeries,
      id,
      year: insertSeries.year ?? null,
      issueCount: insertSeries.issueCount ?? null,
      coverStatus: insertSeries.coverStatus ?? null,
      publishedPeriod: insertSeries.publishedPeriod ?? null,
      seriesUrl: insertSeries.seriesUrl ?? null,
      coversUrl: insertSeries.coversUrl ?? null,
      scansUrl: insertSeries.scansUrl ?? null,
      featuredCoverUrl: insertSeries.featuredCoverUrl ?? null,
      description: insertSeries.description ?? null,
      seriesEmbedding: insertSeries.seriesEmbedding ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.comicSeries.set(id, series);
    return series;
  }

  async updateComicSeries(id: string, updateData: Partial<InsertComicSeries>): Promise<ComicSeries | undefined> {
    const series = this.comicSeries.get(id);
    if (!series) return undefined;
    
    const updatedSeries: ComicSeries = {
      ...series,
      ...updateData,
      updatedAt: new Date()
    };
    this.comicSeries.set(id, updatedSeries);
    return updatedSeries;
  }

  async deleteComicSeries(id: string): Promise<boolean> {
    return this.comicSeries.delete(id);
  }

  async createBulkComicSeries(seriesList: InsertComicSeries[]): Promise<ComicSeries[]> {
    const results: ComicSeries[] = [];
    for (const insertSeries of seriesList) {
      const series = await this.createComicSeries(insertSeries);
      results.push(series);
    }
    return results;
  }

  // Comic Issues management
  async getComicIssue(id: string): Promise<ComicIssue | undefined> {
    return this.comicIssues.get(id);
  }

  async getComicIssues(filters?: { seriesId?: string; search?: string; writer?: string; artist?: string; limit?: number }): Promise<ComicIssue[]> {
    let issues = Array.from(this.comicIssues.values());
    
    if (filters?.seriesId) {
      issues = issues.filter(issue => issue.seriesId === filters.seriesId);
    }
    
    if (filters?.writer) {
      issues = issues.filter(issue => issue.writer?.toLowerCase().includes(filters.writer!.toLowerCase()));
    }
    
    if (filters?.artist) {
      issues = issues.filter(issue => 
        issue.penciler?.toLowerCase().includes(filters.artist!.toLowerCase()) ||
        issue.coverArtist?.toLowerCase().includes(filters.artist!.toLowerCase())
      );
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      issues = issues.filter(issue => 
        issue.comicName.toLowerCase().includes(searchLower) ||
        issue.issueTitle.toLowerCase().includes(searchLower) ||
        issue.issueDescription?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.limit) {
      issues = issues.slice(0, filters.limit);
    }
    
    return issues;
  }

  async getComicIssuesBySeriesId(seriesId: string): Promise<ComicIssue[]> {
    return Array.from(this.comicIssues.values()).filter(issue => issue.seriesId === seriesId);
  }

  async createComicIssue(insertIssue: InsertComicIssue): Promise<ComicIssue> {
    const id = randomUUID();
    const issue: ComicIssue = {
      ...insertIssue,
      id,
      seriesId: insertIssue.seriesId ?? null,
      activeYears: insertIssue.activeYears ?? null,
      publishDate: insertIssue.publishDate ?? null,
      issueDescription: insertIssue.issueDescription ?? null,
      penciler: insertIssue.penciler ?? null,
      writer: insertIssue.writer ?? null,
      coverArtist: insertIssue.coverArtist ?? null,
      imprint: insertIssue.imprint ?? null,
      format: insertIssue.format ?? null,
      rating: insertIssue.rating ?? null,
      price: insertIssue.price ?? null,
      coverImageUrl: insertIssue.coverImageUrl ?? null,
      issueNumber: insertIssue.issueNumber ?? null,
      volume: insertIssue.volume ?? null,
      currentValue: insertIssue.currentValue ?? null,
      gradeCondition: insertIssue.gradeCondition ?? null,
      marketTrend: insertIssue.marketTrend ?? null,
      contentEmbedding: insertIssue.contentEmbedding ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.comicIssues.set(id, issue);
    return issue;
  }

  async updateComicIssue(id: string, updateData: Partial<InsertComicIssue>): Promise<ComicIssue | undefined> {
    const issue = this.comicIssues.get(id);
    if (!issue) return undefined;
    
    const updatedIssue: ComicIssue = {
      ...issue,
      ...updateData,
      updatedAt: new Date()
    };
    this.comicIssues.set(id, updatedIssue);
    return updatedIssue;
  }

  async deleteComicIssue(id: string): Promise<boolean> {
    return this.comicIssues.delete(id);
  }

  async createBulkComicIssues(issuesList: InsertComicIssue[]): Promise<ComicIssue[]> {
    const results: ComicIssue[] = [];
    for (const insertIssue of issuesList) {
      const issue = await this.createComicIssue(insertIssue);
      results.push(issue);
    }
    return results;
  }

  // Comic Creators management
  async getComicCreator(id: string): Promise<ComicCreator | undefined> {
    return this.comicCreators.get(id);
  }

  async getComicCreators(filters?: { role?: string; search?: string; limit?: number }): Promise<ComicCreator[]> {
    let creators = Array.from(this.comicCreators.values());
    
    if (filters?.role) {
      creators = creators.filter(creator => creator.role === filters.role);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      creators = creators.filter(creator => 
        creator.name.toLowerCase().includes(searchLower) ||
        creator.biography?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.limit) {
      creators = creators.slice(0, filters.limit);
    }
    
    return creators;
  }

  async getComicCreatorByName(name: string): Promise<ComicCreator | undefined> {
    return Array.from(this.comicCreators.values()).find(creator => creator.name === name);
  }

  async createComicCreator(insertCreator: InsertComicCreator): Promise<ComicCreator> {
    const id = randomUUID();
    const creator: ComicCreator = {
      ...insertCreator,
      id,
      biography: insertCreator.biography ?? null,
      birthDate: insertCreator.birthDate ?? null,
      deathDate: insertCreator.deathDate ?? null,
      nationality: insertCreator.nationality ?? null,
      awards: insertCreator.awards ?? null,
      notableWorks: insertCreator.notableWorks ?? null,
      socialMediaLinks: insertCreator.socialMediaLinks ?? null,
      websiteUrl: insertCreator.websiteUrl ?? null,
      profileImageUrl: insertCreator.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.comicCreators.set(id, creator);
    return creator;
  }

  async updateComicCreator(id: string, updateData: Partial<InsertComicCreator>): Promise<ComicCreator | undefined> {
    const creator = this.comicCreators.get(id);
    if (!creator) return undefined;
    
    const updatedCreator: ComicCreator = {
      ...creator,
      ...updateData,
      updatedAt: new Date()
    };
    this.comicCreators.set(id, updatedCreator);
    return updatedCreator;
  }

  async deleteComicCreator(id: string): Promise<boolean> {
    return this.comicCreators.delete(id);
  }

  // Featured Comics management
  async getFeaturedComic(id: string): Promise<FeaturedComic | undefined> {
    return this.featuredComics.get(id);
  }

  async getFeaturedComics(filters?: { featureType?: string; isActive?: boolean; limit?: number }): Promise<FeaturedComic[]> {
    let comics = Array.from(this.featuredComics.values());
    
    if (filters?.featureType) {
      comics = comics.filter(comic => comic.featureType === filters.featureType);
    }
    
    if (filters?.isActive !== undefined) {
      comics = comics.filter(comic => comic.isActive === filters.isActive);
    }
    
    // Sort by display order
    comics.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    if (filters?.limit) {
      comics = comics.slice(0, filters.limit);
    }
    
    return comics;
  }

  async createFeaturedComic(insertFeatured: InsertFeaturedComic): Promise<FeaturedComic> {
    const id = randomUUID();
    const featured: FeaturedComic = {
      ...insertFeatured,
      id,
      subtitle: insertFeatured.subtitle ?? null,
      description: insertFeatured.description ?? null,
      featuredImageUrl: insertFeatured.featuredImageUrl ?? null,
      seriesId: insertFeatured.seriesId ?? null,
      displayOrder: insertFeatured.displayOrder ?? 0,
      isActive: insertFeatured.isActive ?? true,
      startDate: insertFeatured.startDate ?? null,
      endDate: insertFeatured.endDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.featuredComics.set(id, featured);
    return featured;
  }

  async updateFeaturedComic(id: string, updateData: Partial<InsertFeaturedComic>): Promise<FeaturedComic | undefined> {
    const featured = this.featuredComics.get(id);
    if (!featured) return undefined;
    
    const updatedFeatured: FeaturedComic = {
      ...featured,
      ...updateData,
      updatedAt: new Date()
    };
    this.featuredComics.set(id, updatedFeatured);
    return updatedFeatured;
  }

  async deleteFeaturedComic(id: string): Promise<boolean> {
    return this.featuredComics.delete(id);
  }

  // Comic data aggregation for dashboards
  async getComicMetrics(): Promise<{ totalSeries: number; totalIssues: number; totalCreators: number; totalCovers: number }> {
    return {
      totalSeries: this.comicSeries.size,
      totalIssues: this.comicIssues.size,
      totalCreators: this.comicCreators.size,
      totalCovers: Array.from(this.comicSeries.values()).filter(s => s.featuredCoverUrl || s.coversUrl).length
    };
  }
  
  async getFeaturedComicsCount(): Promise<number> {
    return this.featuredComics.size;
  }

  async getTrendingComicSeries(limit?: number): Promise<ComicSeries[]> {
    const series = Array.from(this.comicSeries.values());
    
    // Simple trending logic - series with more recent years or more covers
    const trending = series
      .filter(s => s.featuredCoverUrl || s.coversUrl)
      .sort((a, b) => {
        const aYear = a.year || 0;
        const bYear = b.year || 0;
        return bYear - aYear;
      });
    
    return limit ? trending.slice(0, limit) : trending;
  }

  async getFeaturedComicsForHomepage(): Promise<FeaturedComic[]> {
    return this.getFeaturedComics({ isActive: true, limit: 10 });
  }
`;
