package pdfConverter;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;


public class PDFConverter
{
    public void CreateTable(String pdfTitle, String[] header, int columns, JsonArray json) throws DocumentException, FileNotFoundException
    {
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream("..\\" + pdfTitle + ".pdf"));  //this will create the pdf in my apache-tomcat-9.0.56 folder (instead of bin)

        document.open();

        PdfPTable table = new PdfPTable(columns);       //create a table with a given number of columns
        addTableHeader(table, header);                  //add header
        addRows(table, json);

        document.add(table);
        document.addCreationDate();
        document.close();
    }

    private void addTableHeader(PdfPTable table, String[] header)   //given a header string creates a header row with the values of the string array
    {
        for(int i = 0; i < header.length; i++)
        {
            PdfPCell headercell = new PdfPCell();
            headercell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            headercell.setBorderWidth(2);
            headercell.setPhrase(new Phrase(header[i]));
            table.addCell(headercell);
        }
    }

    private void addRows(PdfPTable table, JsonArray json)    //give the number of columns and the rows you want to insert
    {
        for(int i = 0; i < json.size(); i++)
        {
            table.addCell(json.get(i).getAsJsonObject().get("status").getAsString());
            table.addCell(json.get(i).getAsJsonObject().get("randevouz_id").getAsString());
            table.addCell(json.get(i).getAsJsonObject().get("date_time").getAsString());
            table.addCell(json.get(i).getAsJsonObject().get("price").getAsString());
            table.addCell(json.get(i).getAsJsonObject().get("doctor_info").getAsString());
            table.addCell(json.get(i).getAsJsonObject().get("user_info").getAsString());
        }
    }
}
