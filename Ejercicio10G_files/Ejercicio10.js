class PictureServer {
    constructor(apiKey) {
        this.apiUrl = 'https://api.unsplash.com';
        this.apiKey = apiKey;
    }
    async getRandomImage() {
        return await $.getJSON(`${this.apiUrl}/photos/random/?client_id=${apiKey}`).then(image => new UnsplashImage(image));
    }
}
class UnsplashImage {
    constructor(image) {
        this.image = image;
    }
    get fullImageUrl() {
        return this.image.urls.full;
    }
    get rawImageUrl() {
        return this.image.urls.raw;
    }
    get regularImageUrl() {
        return this.image.urls.regular;
    }
    get smallImageUrl() {
        return this.image.urls.small;
    }
    get thumbImageUrl() {
        return this.image.urls.thumb;
    }
    get createdDate() {
        return new Date(this.image.created_at).toLocaleDateString('es-ES');
    }
    get createdTime() {
        return new Date(this.image.created_at).toLocaleTimeString('es-ES');
    }
    get uploadedDate() {
        return new Date(this.image.updated_at).toLocaleDateString('es-ES');
    }
    get uploadedTime() {
        return new Date(this.image.updated_at).toLocaleTimeString('es-ES');
    }
    get alt() {
        return this.image.alt_description;
    }
    get description() {
        return this.image.description;
    }
    get downloadUrl() {
        return this.image.links.download;
    }
    get userName() {
        return this.image.user.name;
    }
    get userPortfolioUrl() {
        return this.image.user.portfolio_url;
    }
    get userBio() {
        return this.image.user.bio;
    }
    get exif() {
        return this.image.exif;
    }
    modifyImage(width, height, dpr) {
        const url = this.rawImageUrl;
        if (width !== undefined) {
            const widthN = parseInt(width);
            if (isNaN(width))
                throw new Error('Wrong width value!');
            url += '&w=' + widthN;
        }
        if (height !== undefined) {
            const heightN = parseInt(height);
            if (isNaN(height))
                throw new Error('Wrong height value!');
            url += '&h=' + heightN;
        }
        if (dprN !== undefined) {
            const dprN = parseInt(dpr); ageController($('#userInfo').first(), $('#imageInfo').first(), server, $('figure').first());
            if (isNaN(dpr))
                throw new Error('Wrong dpr value!');
            url += '&dp=' + dprN;
        }
        return url;
    }
}
class ImageController {
    constructor(userInfoSection, imgInfoSection, unsplashServer, figure) {
        this.userInfoSection = userInfoSection;
        this.imgInfoSection = imgInfoSection;
        this.unsplashServer = unsplashServer;
        this.figure = figure;
    }
    loadImageAndUpdateView() {
        $('p').remove();
        $('a').remove();
        this.unsplashServer.getRandomImage().then(img => {
            this.unsplashImage = img;
            this.loadFigure();
            this.loadImageSection();
            this.loadUserSection();
        });
    }
    loadImageSection() {
        const p = document.createElement('p');
        p.append(`La imagen se creó a las ${this.unsplashImage.createdTime} del ${this.unsplashImage.createdDate} y ${this.unsplashImage.userName} la subió el ${this.unsplashImage.uploadedDate} a las ${this.unsplashImage.uploadedTime}`);
        const downloadLink = document.createElement('a');
        downloadLink.append('Click derecho y guardar como... para descargar');
        downloadLink.setAttribute('href', this.unsplashImage.downloadUrl);
        const cameraData = this.unsplashImage.exif;
        const section = $('#cameraInfo').first();
        const cameraP = document.createElement('p');
        let cameraText = '';
        if (Object.values(cameraData).some(attr => attr !== null)) {
            if (cameraData.make !== null)
                cameraText += `El fabricante de la cámara es ${cameraData.make}. `;
            if (cameraData.model !== null)
                cameraText += `Se sacó la foto con el modelo ${cameraData.make}. `;
            if (cameraData.exposure_time !== null)
                cameraText += `Tiene un tiempo de exposición de ${cameraData.exposure_time}. `;

        }
        else
            cameraText = 'No hay datos de la cámara';
        cameraP.append(cameraText);
        section.append(cameraP);
        $(this.imgInfoSection).append(section);
        $(this.imgInfoSection).prepend(downloadLink);
        $(this.imgInfoSection).prepend(p);
    }
    loadUserSection() {
        const nameP = document.createElement('p');
        $(this.userInfoSection).append(nameP);
        if (this.unsplashImage.userBio !== undefined
            && this.unsplashImage.userBio !== null)
            $(this.userInfoSection).children('#userBio').first().append(this.unsplashImage.userBio);
        else
            $(this.userInfoSection).children('#userBio').first().append('No hay biografía para este usuario');
        if (this.unsplashImage.userPortfolioUrl !== undefined
            && this.unsplashImage.userPortfolioUrl !== null) {
            const portfolioLink = document.createElement('a');
            portfolioLink.setAttribute('href', this.unsplashImage.userPortfolioUrl);
            portfolioLink.append('Visita su portfolio!');
            $(this.userInfoSection).children('#userPortfolio').first().append(portfolioLink);
        }
        else
            $(this.userInfoSection).children('#userPortfolio').first().append('Este usuario no tiene portfolio.');
        nameP.append(`El usuario ${this.unsplashImage.userName} es el uploader de esta imagen.`);
    }
    loadFigure() {
        $(this.figure).children('figcaption').first().text(this.unsplashImage.description);
        $(this.figure).children('img').first().attr('src', this.unsplashImage.rawImageUrl);
    }

}
const apiKey = '23A5ZZ3OXpk1luPTbsxL84zbU5RGOfq-gnoBLkeJirs';
const server = new PictureServer(apiKey);
const controller = new ImageController($('#userInfo')[0], $('#imageInfo')[0], server, $('figure')[0]);
controller.loadImageAndUpdateView();