#include <stdio.h>

float fahrtoc(float fahr);

int main()
{
    /* Exercise 1-15
       Rewrite the temperature conversion program of Section 1.2
       to use a function for conversion
    */
    
    float fahr;
    int lower, upper, step;
    
    lower = 0;
    upper = 300;
    step = 20;
    
    fahr = lower;
    printf("%10s\t%10s\n", "Fahrenheit", "Celsius");
    while (fahr <= upper)
    {
        printf("%10.2f\t%10.2f\n", fahr, fahrtoc(fahr));
        fahr = fahr + step;
    }
    return 0;
}

float fahrtoc(float fahr)
{
    float celsius;
    celsius = 5 * (fahr - 32) / 9;
    return celsius;
}
