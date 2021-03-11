const form = document.querySelector('#form');
const resultado = document.querySelector('#result');
const page = document.querySelector('#pagination');

const recordsPerPage = 50;
let totalPages;
let iterator
let actualPage = 1

window.onload = () => {
    form.addEventListener('submit', formValidation)
}

function formValidation(e) {
    e.preventDefault();

    const term = document.querySelector('#term').value;

    if(term === ''){
        errorMessage('You need to enter a valid search term');
        return;
    };

    searchImg()

}

function searchImg() {
   
    const term = document.querySelector('#term').value;
    const key = '20599019-6b0f08064ff04071177ffd30f'
    const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=50&page=${actualPage}`

    fetch(url)
        .then( answer => answer.json())
        .then( result => {
            totalPages = pageCalculator(result.totalHits)
            showImages(result.hits)
        })
}


function showImages(result) {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    };
    
    // console.log(result)
    result.forEach( image => {
    const { previewURL, largeImageURL, imageSize} = image
    
    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
        <div class="bg-white">
            <img class="w-full" src=${previewURL} alt={tags} />
            <div class="p-4">
                <p> Tamaño: ${imageSize} </p>
                <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> Show Img </a>
            </div>
       </div>
    </div>
    `;

    printPager()
})}

function printPager() {
    while(page.firstChild){
        page.removeChild(page.firstChild)
    }

    iterator = createPager(totalPages);

    while(true) {
        const {value, done} = iterator.next();

        if(done) {
            return;
        };

        const button = document.createElement('a');
        button.href = '#';
        button.dataset.pagina = value;
        button.textContent = value;
        button.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded', 'justify-center')
        button.onclick = () => {
            actualPage = value

            const term = document.querySelector('#term').value;
            searchImg(term)
        }
        page.append(button);

        
    };
};

function pageCalculator(total) {
    return parseInt(Math.ceil(total/recordsPerPage));
};

function *createPager(total) {
    for (let i = 1; i<=total ; i++){;
    yield i;
    }
};

function errorMessage(message) {

    const error = document.querySelector('.bg-red-200')

    if(!error) {
        const msjDiv = document.createElement('div');
        msjDiv.textContent = message;
        msjDiv.classList.add('error', 'bg-red-200', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'mx-auto', 'mt-6', 'text-center');
        form.appendChild(msjDiv)

        setTimeout(() => {
            msjDiv.remove()
        }, 2000);
    };  
}
