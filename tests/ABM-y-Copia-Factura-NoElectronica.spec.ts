import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(120000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/Login/ssgBZ010%2FFactura%2FVentas');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ010/Factura/Ventas');
  console.log('Inicio de sesión exitoso');
  
  const botonfiltro = await page.locator('button[title="Filtros"]').nth(1);
  await botonfiltro.click();


  await page.getByLabel('Mostrar comprobantes en').selectOption('FI');
  await page.getByRole('button', { name: 'Filtrar' }).click();

    // Esperar que el contenido se actualice
  await page.waitForTimeout(2000); // Espera 4 segundos para que la página se actualice


async function obtenerNumeroComprobantes(page) {
  // Selecciona el elemento con el XPath
  const smallElement = await page.locator('xpath=//div[10]/span/small');
  // Obtener el texto del elemento
  const contenido = await smallElement.textContent();
  // Buscar el número en el texto
  const match = contenido.trim().match(/\d+/);
  // Convertir el número a entero y devolverlo
  const numero = match ? parseInt(match[0], 10) : NaN;
  return numero;
}

const numeroComprobantes = await obtenerNumeroComprobantes(page);
console.log('Número actual de comprobantes:', numeroComprobantes); // Imprimir para verificar


  await page.getByRole('button', { name: '+' }).click();
  await page.locator('form').filter({ hasText: 'Insertar facturación (ventas' }).getByLabel('Comprobante:').selectOption('FAVEA');

  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice  
  // Localizar el nro de comprobante
  const locator = page.locator('xpath=//div[4]/input');
  const numerocomprob = await locator.inputValue();
  console.log('El nro de comprobante es',numerocomprob);
// Convertir el valor a número
  const numberValueOrigen = parseInt(numerocomprob, 10);


  await page.getByRole('textbox', { name: 'Cliente:' }).fill('carrar');
  await page.getByRole('textbox', { name: 'Cliente:' }).press('Enter');
  await page.getByRole('tab', { name: 'Cuerpo' }).click();
  await page.locator('nav').filter({ hasText: 'Artículos Afectar' }).getByRole('button').first().click();
  await page.getByPlaceholder('Ingrese un nombre de artículo').fill('00318');
  await page.getByPlaceholder('Ingrese un nombre de artículo').press('Enter');
  await page.getByRole('textbox', { name: 'Cantidad:' }).fill('11,00');
  await page.getByRole('textbox', { name: 'Cantidad:' }).press('Enter');


  const grabar = await page.getByRole('button', { name: '' }).first()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
  await grabar.click()


  // Esperar que el contenido se actualice
  await page.waitForTimeout(4000); 

  // Esperar a que el elemento <small> esté disponible
  await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 80000 });


 const numeroFinal = await obtenerNumeroComprobantes(page);
 console.log('Número actual de comprobantes con la factura recien registrada:', numeroFinal); // Imprimir para verificar
 

  //copiar la factura finalizada, obenemos el boton de copiar

  const cop = await page.locator('button[title="Copiar"]').nth(1) //es el segundo boton ya que el 1ro arrojaba error de disabled
  await cop.click()


  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice  
  // Localizar el nro de comprobante
  const locator2 = page.locator('xpath=//div[4]/input');
  const numerocomprob2 = await locator2.inputValue();
  console.log('El nro de comprobante del copiado es',numerocomprob2);
  // Convertir el valor a número
  const numberValuecopiado = parseInt(numerocomprob2, 10);

  //verificamos que el nro comprob luego de copíar se actualizo al siguiente es decir se incremento en 1
  expect(numberValuecopiado).toBe(numberValueOrigen + 1);


  await grabar.press('Enter')


  // Esperar que el contenido se actualice
  await page.waitForTimeout(4000); // Espera 4 segundos para que la página se actualice

  // Esperar a que el elemento <small> esté disponible
  await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 60000 });

const numeroFinalDelCopiado = await obtenerNumeroComprobantes(page);
console.log('Número actual de comprobantes con el copiado:', numeroFinalDelCopiado); // Imprimir para verificar


  // Comprobar si el número de items se incremento en 1 significando que se grabo en Finalizado la factura
  
  expect(numeroFinalDelCopiado).toBe(numeroFinal + 1);


  //ANULACIÓN DE LA FACTURA FINALIZADA

  //modificamos la ultima factura Finalizada
  //clickeamos boton de modificar

  const modi = await page.getByRole('button', { name: '' })
  await modi.click()

  // clicK a boton de anular

  const anu = page.locator('button.btn.btn-danger.text-white[data-toggle="tooltip"][data-placement="top"][title="Anular"]');
  await anu.click()
  //confirmar anulacion
  await page.locator('css=#myModal > div > div > form > div > div.modal-footer > button.btn.btn-primary').click()

  // Esperar que el contenido se actualice
  await page.waitForTimeout(6000); // Espera 6 segundos para que la página se actualice

    // Esperar a que el elemento <small> esté disponible
  await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 60000 });

   const numeroFinalAnul = await obtenerNumeroComprobantes(page);
   console.log('Número final de items con anulado:', numeroFinalAnul); // Imprimir para verificar
  
    // Comprobar si el número de items se incremento en 1 significando que se grabo en Finalizado la factura
    
    expect(numeroFinalAnul).toBe(numeroFinalDelCopiado - 1);

  });
  






    
