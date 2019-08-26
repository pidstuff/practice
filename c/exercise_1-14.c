#include <stdio.h>

#define CHARTYPES 5

int main()
{
    /* Exercise 1-14
       Write a program to print a histogram of the frequencies of different
       characters in its input.
    */
    printf("Input text (press ctrl+d to end):\n");
    int i, j, c, highestfreq, charfreq[CHARTYPES];
    highestfreq = 0;
    
    for (i = 0; i < CHARTYPES; i++)
    {
        charfreq[i] = 0;
    }
    
    while ((c = getchar()) != EOF)
    {
        if (c >= 'a' && c <= 'z')
            charfreq[0]++;
        else if (c >= 'A' && c <= 'Z')
            charfreq[1]++;
        else if (c >= '0' && c <= '9')
            charfreq[2]++;
        else if (c == ' ' || c == '\n' || c == '\t')
            charfreq[3]++;
        else
            ++charfreq[4];
    }
    
    /* Get the highest frequency count */
    for (i = 0; i < CHARTYPES; i++)
    {
        if (charfreq[i] > highestfreq)
            highestfreq = charfreq[i];
    }
    
    /* Create the histogram */
    printf("\nL%5sU%5sN%5sW%5sS\n", " ", " ", " ", " ");
    for (i = 0; i < highestfreq; i++)
    {
        printf("\n");
        for (j = 0; j < CHARTYPES; j++)
        {
            if (charfreq[j] > 0)
            {
                printf("#%5s", " ");
                charfreq[j]--;
            }
            else
                printf("%6s", " ");
        }
    }
    printf("\n\n%2s : %10s", "L", "Lowercase");
    printf("\n%2s : %10s", "U", "Uppercase");
    printf("\n%2s : %10s", "N", "Numeric");
    printf("\n%2s : %10s", "W", "Whitespace");
    printf("\n%2s : %10s\n", "S", "Special");
}
